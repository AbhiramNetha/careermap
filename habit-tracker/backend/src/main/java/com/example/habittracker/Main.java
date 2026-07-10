package com.example.habittracker;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.sql.*;
import java.util.*;

public class Main {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/habit_tracker?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "";

    public static void main(String[] args) throws Exception {
        createTables();
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/habits", new HabitHandler());
        server.createContext("/api/habits/", new HabitByIdHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Habit tracker backend running on http://localhost:8080");
    }

    private static void createTables() throws Exception {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            Statement statement = connection.createStatement();
            statement.executeUpdate("""
                CREATE TABLE IF NOT EXISTS habits (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    completed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """);
            System.out.println("Database ready.");
        }
    }

    static class HabitHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                if ("GET".equals(exchange.getRequestMethod())) {
                    List<Map<String, Object>> habits = getHabits();
                    sendJson(exchange, 200, habits);
                } else if ("POST".equals(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    Map<String, String> data = parseJson(body);
                    String name = data.get("name");
                    String category = data.get("category");
                    if (name == null || name.isBlank()) {
                        sendJson(exchange, 400, Map.of("message", "Habit name is required"));
                        return;
                    }
                    insertHabit(name, category == null ? "General" : category);
                    sendJson(exchange, 201, Map.of("message", "Habit added successfully"));
                } else {
                    exchange.sendResponseHeaders(405, -1);
                }
            } catch (Exception e) {
                sendJson(exchange, 500, Map.of("message", e.getMessage()));
            }
        }
    }

    static class HabitByIdHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] parts = path.split("/");
            if (parts.length < 4) {
                exchange.sendResponseHeaders(404, -1);
                return;
            }

            String habitId = parts[3];
            if ("toggle".equals(parts[4])) {
                toggleHabit(habitId);
                sendJson(exchange, 200, Map.of("message", "Habit updated"));
                return;
            }
            exchange.sendResponseHeaders(404, -1);
        }
    }

    private static List<Map<String, Object>> getHabits() throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM habits ORDER BY id DESC")) {
            ResultSet rs = preparedStatement.executeQuery();
            while (rs.next()) {
                Map<String, Object> habit = new LinkedHashMap<>();
                habit.put("id", rs.getInt("id"));
                habit.put("name", rs.getString("name"));
                habit.put("category", rs.getString("category"));
                habit.put("completed", rs.getBoolean("completed"));
                result.add(habit);
            }
        }
        return result;
    }

    private static void insertHabit(String name, String category) throws Exception {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO habits (name, category) VALUES (?, ?)")) {
            preparedStatement.setString(1, name);
            preparedStatement.setString(2, category);
            preparedStatement.executeUpdate();
        }
    }

    private static void toggleHabit(String habitId) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement("UPDATE habits SET completed = NOT completed WHERE id = ?")) {
            preparedStatement.setInt(1, Integer.parseInt(habitId));
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        InputStream inputStream = exchange.getRequestBody();
        return new String(inputStream.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
    }

    private static Map<String, String> parseJson(String body) {
        Map<String, String> result = new HashMap<>();
        String cleaned = body.replace("{", "").replace("}", "").trim();
        if (cleaned.isEmpty()) return result;
        for (String part : cleaned.split(",")) {
            String[] pair = part.split(":", 2);
            if (pair.length == 2) {
                result.put(pair[0].replace("\"", "").trim(), pair[1].replace("\"", "").trim());
            }
        }
        return result;
    }

    private static void sendJson(HttpExchange exchange, int statusCode, Object data) throws IOException {
        String json = data instanceof String ? (String) data : toJson(data);
        byte[] body = json.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, body.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(body);
        }
    }

    private static String toJson(Object data) {
        if (data instanceof Map<?, ?> map) {
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            int i = 0;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (i++ > 0) sb.append(",");
                sb.append("\"").append(entry.getKey()).append("\"").append(":");
                Object value = entry.getValue();
                if (value instanceof String) {
                    sb.append("\"").append(value).append("\"");
                } else if (value instanceof Boolean || value instanceof Number) {
                    sb.append(value);
                } else {
                    sb.append("\"").append(value).append("\"");
                }
            }
            sb.append("}");
            return sb.toString();
        }

        if (data instanceof List<?> list) {
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        }

        if (data instanceof Map.Entry<?, ?> entry) {
            return toJson(Map.of(entry.getKey(), entry.getValue()));
        }

        return "\"" + data + "\"";
    }
}
