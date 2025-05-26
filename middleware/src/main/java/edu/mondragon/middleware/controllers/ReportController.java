package edu.mondragon.middleware.controllers;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Properties;

@RestController
@RequestMapping("/api")
public class ReportController {

    @PostMapping("/report")
    public ResponseEntity<String> sendReport(@RequestBody ReportRequest report) {
        final String username = "andercruzgutierrezz@gmail.com";
        final String password = "tplz tduu dhtz tsix";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com"); // O el servidor SMTP que uses
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse("ander@lauden.es") // El correo del receptor
            );
            message.setSubject("AAS Report - ID: " + report.getAasId());
            message.setText("Mensaje:\n\n" + report.getMessage());

            Transport.send(message);

            return ResponseEntity.ok("Email sent successfully");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }
}
