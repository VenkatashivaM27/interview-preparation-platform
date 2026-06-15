package com.interviewprep.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketChatController {

    @MessageMapping("/chat.typing")
    @SendTo("/topic/typing")
    public Map<String, Object> typing(Map<String, Object> payload) {
        return payload;
    }
}
