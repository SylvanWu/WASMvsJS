# WASM Scientific Calculator with Performance Comparison

This project is a feature-rich scientific calculator built with **Rust + WebAssembly** and **React**, designed to compare the performance of **WASM** vs **JavaScript** implementations. &#x20;

It includes: &#x20;

- A complete calculator UI in React &#x20;
- Core logic written in Rust and compiled to WebAssembly &#x20;
- JS fallback logic written in native JavaScript &#x20;
- Performance benchmarking between WASM and JS modes &#x20;
- Heavy computation tests (factorial summation, recursive Fibonacci) to demonstrate WASM's computational strengths &#x20;

---

## 🚀 Features &#x20;

- Basic operations: `+`, `-`, `*`, `/`, `%`, `=`, `±` &#x20;
- Scientific operations: `sqrt`, `square`, `exp`, `ln`, `log`, `mod` &#x20;
- Expression display & precision handling &#x20;
- **WASM vs JS** performance toggle &#x20;
- Built-in performance test cases: &#x20;
  - Short/medium/long expressions &#x20;
  - Heavy factorial-based computation &#x20;
  - Deep recursive Fibonacci test &#x20;

---

## 📦 Installation &#x20;

### Prerequisites &#x20;

- [Rust  ](https://www.rust-lang.org/tools/install)
- [wasm-pack  ](https://rustwasm.github.io/wasm-pack/installer/)
- Node.js + npm (or yarn) &#x20;

### Clone and Setup &#x20;

```bash
# Clone this repository
https://github.com/your-username/wasm-calculator-demo.git
cd wasm-calculator-demo/www

# Install frontend dependencies
npm install
```

### Build WASM Package &#x20;

```bash
# From the root folder containing src/lib.rs
wasm-pack build --release --target web
```

This will generate a `/pkg` folder containing the WebAssembly module. &#x20;

---

## 🖥️ Usage &#x20;

```bash
# Start the React development server
npm run dev
```

Then open your browser at: [http://localhost:5173](http://localhost:5173)                                                                                               &#x20;

### In the Web App: &#x20;

- Use the calculator normally &#x20;
- Click **"WASM Mode"** or **"JS Mode"** to toggle calculation engines &#x20;
- Click **"Run Performance Test"** to benchmark multiple cases &#x20;

---

## 📊 Benchmark Results &#x20;

The app includes automated benchmarking of several scenarios: &#x20;

| Test Case  | Description                             |
| ---------- | --------------------------------------- |
| `short`    | Small expression like `1+2+3*4-5/2`     |
| `medium`   | Expression with \~1000 terms            |
| `long`     | Expression with \~100,000 terms         |
| `heavy`    | Sum of factorials from 1 to 5000        |
| `fib`      | Recursive computation of Fibonacci(35)  |

\*\*WASM performs significantly faster in recursive and numerical-heavy tasks.  \*\*

---

## 📁 Project Structure &#x20;

```
├── src/lib.rs              # Rust calculator core
├── www/src/App.jsx         # React frontend with mode toggle and UI
├── www/src/CalculatorJS.js # JS version of calculator logic
├── www/package.json        # React project setup
├── pkg/                    # WASM build output
```

---

## 🛠️ Build for Production &#x20;

```bash
npm run build
```

---

## ✨ Credits &#x20;

- Rust + wasm-bindgen for WASM logic &#x20;
- React + Vite for frontend &#x20;
- Tailwind CSS for quick UI styling &#x20;

---

## 📌 License &#x20;

MIT License. Feel free to use, extend, or contribute! &#x20;

---

## 💡 Future Improvements &#x20;

- Add matrix operation benchmarks &#x20;
- Add tokenizer + AST-based expression evaluator &#x20;
- Support symbolic computation (e.g., derivative, simplify) &#x20;

---

Happy calculating! 🧮✨ &#x20;

