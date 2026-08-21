package com.emmvee.backend;

import com.emmvee.backend.dto.LoginRequest;
import com.emmvee.backend.dto.LoginResponse;
import com.emmvee.backend.dto.UserRequest;
import com.emmvee.backend.dto.UserResponse;
import com.emmvee.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthenticationTests {

    @Autowired
    private UserService userService;

    @Test
    void registrationShouldCreateUser() {

        String email =
                "test_" + System.currentTimeMillis()
                        + "@example.com";

        UserRequest request = new UserRequest();

        request.setName("Test User");
        request.setEmail(email);
        request.setPassword("Password123");

        UserResponse response =
                userService.register(request);

        assertNotNull(response);
        assertEquals("Test User", response.getName());
        assertEquals(email, response.getEmail());
        assertEquals("USER", response.getRole());
    }

    @Test
    void loginShouldReturnJwt() {

        String email =
                "login_" + System.currentTimeMillis()
                        + "@example.com";

        UserRequest registerRequest =
                new UserRequest();

        registerRequest.setName("Login Test");
        registerRequest.setEmail(email);
        registerRequest.setPassword("Password123");

        userService.register(registerRequest);

        LoginRequest loginRequest =
                new LoginRequest();

        loginRequest.setEmail(email);
        loginRequest.setPassword("Password123");

        LoginResponse response =
                userService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(email, response.getEmail());
        assertEquals("USER", response.getRole());
    }
}
