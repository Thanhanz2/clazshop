package com.claz.rest.controllers;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.claz.repositories.CustomerRepository;
import com.claz.repositories.OrderDetailRepository;
import com.claz.repositories.OrderRepository;
import com.claz.services.CustomerService;
import com.claz.services.ProductService;

@CrossOrigin
@RestController
public class BurnChartRestController {

	@Autowired
	ProductService productService;

	@Autowired
	CustomerService customerService;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private CustomerRepository customerRepository;

	@GetMapping("/api/revenue/product")
	public ResponseEntity<List<Map<String, Object>>> getProductRevenue(@RequestParam int year,
			@RequestParam(required = false) Integer month) {
		try {
			List<Map<String, Object>> revenueData = orderRepository.getProductRevenue(year, month);
			return ResponseEntity.ok(revenueData);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	@GetMapping("/api/user/registrations/monthly")
	public ResponseEntity<List<Map<String, Object>>> getMonthlyUserRegistrations(@RequestParam int year) {
		try {
			List<Map<String, Object>> registrationData = customerRepository.getMonthlyUserRegistrations(year);
			return ResponseEntity.ok(registrationData);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@GetMapping("/api/revenue/monthly")
	public ResponseEntity<List<Map<String, Object>>> getAnnualRevenue(@RequestParam int year) {
		List<Map<String, Object>> revenueData = orderRepository.getMonthlyRevenueByYear(year);
		return ResponseEntity.ok(revenueData);
	}
}
