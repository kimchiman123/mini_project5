package com.aivle0102.book.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {
    @RequestMapping("/login/form")
    public String index(HttpSession session) throws Exception {
        if (session.getAttribute("user") != null) {
            return "redirect:/main";
        }
        return "/login/form";
    }
}
