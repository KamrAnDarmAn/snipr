# Contributing to Snipr

Thank you for considering contributing to **Snipr**!  
This project thrives because of contributors like you who help improve features, fix bugs, and make it better for everyone.

---

## 📋 Contribution Guidelines

### 1️⃣ Reporting Bugs

- Search the [Issues](../../issues) to check if the bug already exists.
- If not found, create a new **Bug Report** and include:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots (if applicable)
  - Environment details (OS, Node.js version, Database, etc.)

---

### 2️⃣ Suggesting Features

- Before suggesting, check [Issues](../../issues) for similar requests.
- Clearly describe:
  - The problem you’re trying to solve
  - Your proposed solution
  - Any alternatives you’ve considered

---

### 3️⃣ Setting Up the Project Locally

1. **Fork** the repository
2. **Clone** your fork:

   ```bash
   git clone https://github.com/KamrAnDarmAn/snipr.git
   cd snipr
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file:

   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/snipr"
   PORT=5000
   ```

5. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:

   ```bash
   npm start
   ```

---

### 4️⃣ Making Changes

- Create a new branch for your feature or fix:

  ```bash
  git checkout -b feature/your-feature
  ```

- Follow the project’s coding style.
- Write clear commit messages:

  ```bash
  git commit -m "Add: new QR code customization feature"
  ```

---

### 5️⃣ Submitting a Pull Request

1. Push your branch:

   ```bash
   git push origin feature/your-feature
   ```

2. Open a Pull Request to the `main` branch of the original repository.
3. Fill out the PR template with:

   - What the change does
   - Why it’s needed
   - Any relevant screenshots or test results

---

## 📝 Code Style

- Use **Prettier** or follow standard JavaScript style conventions.
- Keep functions small and focused.
- Add comments where code may not be obvious.

---

## ✅ Commit Message Guidelines

- **Add:** For new features
- **Fix:** For bug fixes
- **Update:** For updates to existing code
- **Docs:** For documentation changes
- **Refactor:** For code refactoring

---

## ❤️ Recognition

All contributors will be listed in the **Contributors** section of the README.

Thank you for helping make **Snipr** better! 🚀
