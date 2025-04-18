use wasm_bindgen::prelude::*;
use std::f64::consts::E;

#[wasm_bindgen]
#[derive(Debug)]
pub struct Calculator {
    current_value: f64,
    stored_value: Option<f64>,
    pending_operation: Option<String>,
    has_decimal: bool,
    decimal_places: u32,
    expression: String,
}

#[wasm_bindgen]
impl Calculator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Calculator {
        Calculator {
            current_value: 0.0,
            stored_value: None,
            pending_operation: None,
            has_decimal: false,
            decimal_places: 0,
            expression: String::new(),
        }
    }

    #[wasm_bindgen]
    pub fn evaluate_expression(&mut self, expr: &str) {
        match parse_expression(expr) {
            Ok(result) => self.current_value = result,
            Err(_) => self.current_value = f64::NAN,
        }
    }

    #[wasm_bindgen]
    pub fn fib_recursive(&self, n: u32) -> u32 {
        fn fib(n: u32) -> u32 {
            if n <= 1 {
                n
            } else {
                fib(n - 1) + fib(n - 2)
            }
        }
    
        fib(n)
    }
    

    #[wasm_bindgen]
    pub fn input_digit(&mut self, digit: u8) {
        let digit = digit.min(9).max(0) as f64;
        if self.has_decimal {
            self.decimal_places += 1;
            self.current_value += digit / (10.0f64).powi(self.decimal_places as i32);
        } else {
            self.current_value = self.current_value * 10.0 + digit;
        }
        self.expression.push_str(&format!("{}", digit as u8));
    }

    #[wasm_bindgen]
    pub fn input_decimal(&mut self) {
        if !self.has_decimal {
            self.has_decimal = true;
            self.decimal_places = 0;
            self.expression.push('.');
        }
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.current_value = 0.0;
        self.stored_value = None;
        self.pending_operation = None;
        self.has_decimal = false;
        self.decimal_places = 0;
        self.expression.clear();
    }

    #[wasm_bindgen]
    pub fn toggle_sign(&mut self) {
        self.current_value = -self.current_value;
        self.expression = format!("(-{})", self.expression);
    }

    #[wasm_bindgen]
    pub fn percent(&mut self) {
        self.current_value /= 100.0;
        self.expression.push_str("%");
    }

    #[wasm_bindgen]
    pub fn perform_operation(&mut self, op: String) {
        match op.as_str() {
            "=" => {
                self.calculate();
                self.expression.clear();
                self.expression.push_str(&self.current_value.to_string());
            }
            "sqrt" => {
                self.current_value = self.current_value.sqrt();
                self.expression = format!("√({})", self.expression);
            }
            "square" => {
                self.current_value = self.current_value.powi(2);
                self.expression = format!("({})²", self.expression);
            }
            "mod" => {
                if let Some(stored) = self.stored_value {
                    self.current_value = stored % self.current_value;
                    self.stored_value = None;
                    self.pending_operation = None;
                }
            }
            "exp" => {
                self.current_value = E.powf(self.current_value);
                self.expression = format!("e^({})", self.expression);
            }
            "ln" => {
                self.current_value = self.current_value.ln();
                self.expression = format!("ln({})", self.expression);
            }
            "log" => {
                self.current_value = self.current_value.log10();
                self.expression = format!("log({})", self.expression);
            }
            _ => {
                if self.pending_operation.is_some() {
                    self.calculate();
                }
                self.stored_value = Some(self.current_value);
                self.pending_operation = Some(op.clone());
                self.expression.push_str(&format!(" {} ", op));
                self.current_value = 0.0;
                self.has_decimal = false;
                self.decimal_places = 0;
            }
        }
    }

    #[wasm_bindgen]
    pub fn calculate(&mut self) {
        if let (Some(stored), Some(op)) = (self.stored_value, &self.pending_operation) {
            match op.as_str() {
                "+" => self.current_value = stored + self.current_value,
                "-" => self.current_value = stored - self.current_value,
                "*" => self.current_value = stored * self.current_value,
                "/" => {
                    if self.current_value != 0.0 {
                        self.current_value = stored / self.current_value;
                    } else {
                        self.current_value = f64::NAN;
                    }
                }
                _ => (),
            }
            self.stored_value = None;
            self.pending_operation = None;
        }
    }

    #[wasm_bindgen]
    pub fn get_value(&self) -> String {
        if self.current_value.is_nan() {
            return "Error".to_string();
        }

        let mut value = self.current_value;
        if self.has_decimal {
            let factor = 10f64.powi(self.decimal_places as i32);
            value = (value * factor).round() / factor;
        }

        value.to_string()
    }

    #[wasm_bindgen]
    pub fn get_expression(&self) -> String {
        self.expression.clone()
    }

    #[wasm_bindgen]
    pub fn heavy_compute(&self, n: u32) -> f64 {
        fn factorial(x: u32) -> f64 {
            (1..=x).fold(1.0, |acc, val| acc * val as f64)
        }

        let mut sum = 0.0;
        for i in 1..=n {
            sum += factorial(i);
        }
        sum
    }
}

// A simple expression parser for basic arithmetic operations
fn parse_expression(expr: &str) -> Result<f64, ()> {
    let mut parser = Parser::new(expr);
    let result = parser.parse_expr()?;
    if parser.next_char().is_some() {
        return Err(());
    }
    Ok(result)
}
struct Parser<'a> {
    input: std::str::Chars<'a>,
    current: Option<char>,
}

impl<'a> Parser<'a> {
    fn new(s: &'a str) -> Self {
        let mut input = s.chars();
        let current = input.next();
        Parser { input, current }
    }

    fn next_char(&mut self) -> Option<char> {
        let next = self.current;
        self.current = self.input.next();
        next
    }

    fn peek(&self) -> Option<char> {
        self.current
    }

    fn eat_whitespace(&mut self) {
        while self.peek() == Some(' ') {
            self.next_char();
        }
    }

    fn parse_expr(&mut self) -> Result<f64, ()> {
        let mut result = self.parse_term()?;

        loop {
            self.eat_whitespace();
            match self.peek() {
                Some('+') => {
                    self.next_char();
                    result += self.parse_term()?;
                }
                Some('-') => {
                    self.next_char();
                    result -= self.parse_term()?;
                }
                _ => break,
            }
        }

        Ok(result)
    }
// Parses a term, which can be a product or quotient of factors
    fn parse_term(&mut self) -> Result<f64, ()> {
        let mut result = self.parse_factor()?;

        loop {
            self.eat_whitespace();
            match self.peek() {
                Some('*') => {
                    self.next_char();
                    result *= self.parse_factor()?;
                }
                Some('/') => {
                    self.next_char();
                    let divisor = self.parse_factor()?;
                    if divisor == 0.0 {
                        return Err(());
                    }
                    result /= divisor;
                }
                _ => break,
            }
        }

        Ok(result)
    }
// Parses a factor, which can be a number or an expression in parentheses
    fn parse_factor(&mut self) -> Result<f64, ()> {
        self.eat_whitespace();
        match self.peek() {
            Some('(') => {
                self.next_char();
                let result = self.parse_expr()?;
                if self.next_char() != Some(')') {
                    return Err(());
                }
                Ok(result)
            }
            Some(c) if c.is_digit(10) || c == '.' => self.parse_number(),
            _ => Err(()),
        }
    }
// Parses a number, including decimal points
    fn parse_number(&mut self) -> Result<f64, ()> {
        let mut num_str = String::new();
        while let Some(c) = self.peek() {
            if c.is_digit(10) || c == '.' {
                num_str.push(c);
                self.next_char();
            } else {
                break;
            }
        }

        num_str.parse::<f64>().map_err(|_| ())
    }
}
