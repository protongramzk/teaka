# Limit Fungsi Aljabar & Trigonometri

Limit menjelaskan perilaku suatu fungsi ketika variabelnya mendekati nilai tertentu secara spesifik.

$$\lim_{x \to a} f(x) = L$$

---

## 1. Limit Fungsi Aljabar

Jika substitusi langsung menghasilkan bentuk tak tentu $\frac{0}{0}$, gunakan salah satu metode berikut:

### a. Metode Pemfaktoran
Digunakan untuk menghilangkan pembuat nol pada penyebut dan pembilang.

**Contoh:**
$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2}$$

**Penyelesaian:**
$$\lim_{x \to 2} \frac{(x - 2)(x + 2)}{x - 2} = \lim_{x \to 2} (x + 2) = 2 + 2 = 4$$

### b. Perkalian Sekawan
Biasa dipakai ketika bentuk fungsi memuat operasi akar.

**Rumus Sekawan:** $(\sqrt{a} - \sqrt{b})(\sqrt{a} + \sqrt{b}) = a - b$

---

## 2. Limit Trigonometri Khusus

Untuk limit fungsi trigonometri ketika $x \to 0$, berlaku identitas dasar berikut:

$$\lim_{x \to 0} \frac{\sin ax}{bx} = \frac{a}{b}$$

$$\lim_{x \to 0} \frac{\tan ax}{bx} = \frac{a}{b}$$

$$\lim_{x \to 0} \frac{\sin ax}{\tan bx} = \frac{a}{b}$$

### Contoh Soal:
Hitunglah $\lim_{x \to 0} \frac{\sin 6x}{\tan 2x}$.

**Penyelesaian:**
Dengan menerapkan sifat dasar limit trigonometri:

$$\lim_{x \to 0} \frac{\sin 6x}{\tan 2x} = \frac{6}{2} = 3$$

> **Ingat:** Sifat dasar ini **hanya berlaku** untuk fungsi $\sin$ dan $\tan$ ketika mendekati $0$. Jika terdapat fungsi $\cos$, ubah terlebih dahulu menggunakan identitas trigonometri seperti $\cos 2x = 1 - 2\sin^2 x$.
