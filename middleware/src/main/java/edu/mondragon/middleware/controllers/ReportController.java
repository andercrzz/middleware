package edu.mondragon.middleware.controllers;

import java.util.Base64;
import java.util.Properties;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.activation.DataHandler;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;

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
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            
            String[] recipients = report.getEmails().split("\\s*,\\s*");
            message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(String.join(",", recipients))
            );
            
            message.setSubject("AAS Report - ID: " + report.getAasId());

            // Quitar el prefijo y decodificar la imagen
            String base64Data = report.getChartImage().split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // Crear el cuerpo del mensaje (texto)
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText(report.getMessage());

            // Crear la parte de la imagen adjunta
            MimeBodyPart imagePart = new MimeBodyPart();
            imagePart.setDataHandler(new DataHandler(
                new ByteArrayDataSource(imageBytes, "image/png")));
            imagePart.setFileName("grafico.png");

            // Combinar ambas partes
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(textPart);
            multipart.addBodyPart(imagePart);

            message.setContent(multipart);

            Transport.send(message);

            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }
}
