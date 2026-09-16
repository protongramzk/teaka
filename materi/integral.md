# Integral Tak Tentu & Tentu

Integral merupakan operasi kebalikan dari diferensial (turunan), sering disebut juga sebagai **antiturunan**.

---

## 1. Integral Tak Tentu

Jika $F'(x) = f(x)$, maka antiturunan dari $f(x)$ dirumuskan sebagai:

$$\int f(x) \, dx = F(x) + C$$

Dengan $C$ adalah konstanta integrasi.

### Rumus Dasar Integral Aljabar
Untuk $n \neq -1$:

$$\int x^n \, dx = \frac{1}{n+1} x^{n+1} + C$$

$$\int a \cdot x^n \, dx = \frac{a}{n+1} x^{n+1} + C$$

### Contoh Soal:
Hitunglah hasil dari $\int (6x^2 - 4x + 3) \, dx$.

**Penyelesaian:**
$$\int (6x^2 - 4x + 3) \, dx = \frac{6}{3}x^3 - \frac{4}{2}x^2 + 3x + C$$
$$\int (6x^2 - 4x + 3) \, dx = 2x^3 - 2x^2 + 3x + C$$

---

## 2. Integral Tentu

Integral tentu memiliki batas atas dan batas bawah, digunakan untuk menghitung luas daerah di bawah kurva.

$$\int_{a}^{b} f(x) \, dx = \left[ F(x) \right]_{a}^{b} = F(b) - F(a)$$

### Contoh Soal:
Hitunglah nilai dari $\int_{1}^{3} 3x^2 \, dx$.

**Penyelesaian:**
1. Carilah antiturunan dari $3x^2$:
   $$F(x) = \int 3x^2 \, dx = x^3$$

2. Masukkan batas atas $b=3$ dan batas bawah $a=1$:
   $$\left[ x^3 \right]_{1}^{3} = (3)^3 - (1)^3 = 27 - 1 = 26$$

> **Tips:** Pada integral tentu, konstanta $C$ saling menghilangkan saat eliminasi $F(b) - F(a)$, jadi tidak perlu dituliskan lagi.
