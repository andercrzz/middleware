package edu.mondragon.middleware.controllers;

public class ReportRequest {
    private String emails;
    private String message;
    private String aasId;
    private String chartImage;

    public String getMessage() {
        return message;
    }

    public String getAasId() {
        return aasId;
    }

    public String getChartImage() {
        return chartImage;
    }

    public void setChartImage(String chartImage) {
        this.chartImage = chartImage;
    }

    public String getEmails() {
        return emails;
    }

    public void setEmails(String emails) {
        this.emails = emails;
    }
}