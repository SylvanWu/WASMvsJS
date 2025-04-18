export class CalculatorJS {
    constructor() {
        this.current_value = 0;
        this.stored_value = null;
        this.pending_operation = null;
        this.has_decimal = false;
        this.decimal_places = 0;
        this.expression = '';
    }
// input functions
    input_digit(digit) {
        digit = Math.min(9, Math.max(0, digit));

        if (this.has_decimal) {
            this.decimal_places += 1;
            this.current_value += digit / Math.pow(10, this.decimal_places);
        } else {
            this.current_value = this.current_value * 10 + digit;
        }

        this.expression += digit.toString();
    }

    input_decimal() {
        if (!this.has_decimal) {
            this.has_decimal = true;
            this.decimal_places = 0;
            this.expression += '.';
        }
    }

    clear() {
        this.current_value = 0;
        this.stored_value = null;
        this.pending_operation = null;
        this.has_decimal = false;
        this.decimal_places = 0;
        this.expression = '';
    }

    toggle_sign() {
        this.current_value = -this.current_value;
        this.expression = `(-${this.expression})`;
    }

    percent() {
        this.current_value /= 100;
        this.expression += '%';
    }

    perform_operation(op) {
        switch (op) {
            case '=':
                this.calculate();
                this.expression = this.current_value.toString();
                break;
            case 'sqrt':
                this.current_value = Math.sqrt(this.current_value);
                this.expression = `√(${this.expression})`;
                break;
            case 'square':
                this.current_value = Math.pow(this.current_value, 2);
                this.expression = `(${this.expression})²`;
                break;
            case 'mod':
                if (this.stored_value !== null) {
                    this.current_value = this.stored_value % this.current_value;
                    this.stored_value = null;
                    this.pending_operation = null;
                }
                break;
            case 'exp':
                this.current_value = Math.exp(this.current_value);
                this.expression = `e^(${this.expression})`;
                break;
            case 'ln':
                this.current_value = Math.log(this.current_value);
                this.expression = `ln(${this.expression})`;
                break;
            case 'log':
                this.current_value = Math.log10(this.current_value);
                this.expression = `log(${this.expression})`;
                break;
            default:
                if (this.pending_operation !== null) {
                    this.calculate();
                }
                this.stored_value = this.current_value;
                this.pending_operation = op;
                this.expression += ` ${op} `;
                this.current_value = 0;
                this.has_decimal = false;
                this.decimal_places = 0;
        }
    }
// computation functions
    calculate() {
        if (this.stored_value !== null && this.pending_operation !== null) {
            switch (this.pending_operation) {
                case '+':
                    this.current_value = this.stored_value + this.current_value;
                    break;
                case '-':
                    this.current_value = this.stored_value - this.current_value;
                    break;
                case '*':
                    this.current_value = this.stored_value * this.current_value;
                    break;
                case '/':
                    this.current_value = this.current_value !== 0 
                        ? this.stored_value / this.current_value 
                        : NaN;
                    break;
            }
            this.stored_value = null;
            this.pending_operation = null;
        }
    }

    evaluate_expression(expr) {
        try {
            this.current_value = Function('"use strict"; return (' + expr + ')')();
        } catch (e) {
            this.current_value = NaN;
        }
    }
// heavy computation functions
    fib_recursive(n) {
        function fib(n) {
            if (n <= 1) return n;
            return fib(n - 1) + fib(n - 2);
        }
        return fib(n);
    }
    
    get_value() {
        if (isNaN(this.current_value)) {
            return 'Error';
        }

        let value = this.current_value;
        if (this.has_decimal) {
            const factor = Math.pow(10, this.decimal_places);
            value = Math.round(value * factor) / factor;
        }

        return value.toString();
    }

    get_expression() {
        return this.expression;
    }

    // heavy_compute is a placeholder for a heavy computation function
    heavy_compute(n) {
        function factorial(x) {
            let res = 1;
            for (let i = 2; i <= x; i++) {
                res *= i;
            }
            return res;
        }

        let sum = 0;
        for (let i = 1; i <= n; i++) {
            sum += factorial(i);
        }
        return sum;
    }
}
