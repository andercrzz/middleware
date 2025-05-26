package edu.mondragon.middleware.controllers;

public class ReportRequest {
    private String aasId;
    private String message;

    // Getters y setters
    public String getAasId() { return aasId; }
    public void setAasId(String aasId) { this.aasId = aasId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}