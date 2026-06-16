package org.project.bank2.controller;

import org.project.bank2.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GeminiTestController {

    @Autowired
private GeminiService geminiService;

    @GetMapping("/ai/test")
    public String test()
    {
        return geminiService.getCompletion("Say hello in exactly 5 words.");
    }

}
