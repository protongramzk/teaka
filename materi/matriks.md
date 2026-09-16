# Matriks & Sistem Persamaan Linear

Matriks adalah susunan bilangan yang diatur dalam baris dan kolom serta diapit oleh tanda kurung. 

---

## 1. Operasi Dasar Matriks

### a. Penjumlahan dan Pengurangan
Hanya bisa dilakukan pada dua matriks yang memiliki **ordo (ukuran) sama**.

Jika $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$ dan $B = \begin{pmatrix} e & f \\ g & h \end{pmatrix}$, maka:

$$A + B = \begin{pmatrix} a+e & b+f \\ c+g & d+h \end{pmatrix}$$

### b. Perkalian Matriks
Perkalian dua matriks $A_{m \times n} \times B_{n \times p}$ menghasilkan matriks berordo $m \times p$. Syaratnya: **jumlah kolom matriks pertama harus sama dengan jumlah baris matriks kedua**.

$$A \times B = \begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} e & f \\ g & h \end{pmatrix} = \begin{pmatrix} ae+bg & af+bh \\ ce+dg & cf+dh \end{pmatrix}$$

---

## 2. Determinan & Invers Matriks Ordo $2 \times 2$

Misalkan terdapat matriks $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$:

### Determinan Matriks ($\det A$ atau $|A|$)
$$\det A = ad - bc$$

### Invers Matriks ($A^{-1}$)
Matriks memiliki invers jika dan hanya jika $\det A \neq 0$ (Non-Singular).

$$A^{-1} = \frac{1}{\det A} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

---

## 3. Penerapan pada SPLDV

Sistem Persamaan Linear Dua Variabel (SPLDV):
$$\begin{cases} ax + by = p \\ cx + dy = q \end{cases}$$

Dapat diubah ke dalam bentuk matriks:

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} p \\ q \end{pmatrix}$$

Untuk mencari nilai $x$ dan $y$, gunakan rumus invers:

$$\begin{pmatrix} x \\ y \end{pmatrix} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \begin{pmatrix} p \\ q \end{pmatrix}$$

> **Catatan:** Jika determinan matriks koefisien $= 0$, maka sistem persamaan tersebut **tidak memiliki penyelesaian** atau memiliki **banyak penyelesaian tak hingga**.
