package edu.mondragon.middleware.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String showForm() {
        return "index";  // Retorna index.html desde /static
    }
}