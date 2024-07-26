# Günlük Ödüller API

## Genel Bakış

Günlük Ödüller API, kullanıcı kaydı, giriş ve günlük ödül toplama işlemlerini yöneten Node.js tabanlı bir uygulamadır. Uygulama, kullanıcıların her gün ödül toplayabilmesini sağlar ve bir gün kaçırıldığında ödülleri sıfırlayarak yeniden başlatır.

## Özellikler

- Kullanıcı kaydı ve girişi
- Günlük ödül toplama
- Kaçırılan günlerde otomatik ödül sıfırlama
- Güvenli şifreleme

## Kullanılan Teknolojiler

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL
- bcrypt.js (şifreleme için)
- Pug (şablon motoru)
- Moment.js (tarih işlemleri için)

## Kurulum

1. Depoyu klonlayın:

    ```sh
    git clone https://github.com/kullaniciadi/daily-rewards.git
    ```

2. Proje dizinine gidin:

    ```sh
    cd daily-rewards
    ```

3. Bağımlılıkları yükleyin:

    ```sh
    npm install
    ```

4. Çevre değişkenlerinizi ayarlayın. Proje dizininde `.env` dosyası oluşturun ve aşağıdaki bilgileri ekleyin:

    ```env
    DB_USERNAME=postgres
    DB_PASSWORD=password
    DB_DATABASE=postgres
    DB_HOST=127.0.0.1
    DB_DIALECT=postgres
    SECRET_KEY=gizli_anahtar
    ```

5. Veritabanı migrasyonlarını çalıştırın:

    ```sh
    npx sequelize-cli db:migrate --config config.js
    ```

6. Sunucuyu başlatın:

    ```sh
    npm start
    ```
   ya da
    ```sh
    npm run dev
    ```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Kullanım

1. **Yeni kullanıcı kaydı:**

   `/users/register` endpoint'ine `name`, `email` ve `password` alanları ile POST isteği gönderin.

2. **Giriş yapma:**

   `/users/login` endpoint'ine `email` ve `password` alanları ile POST isteği gönderin.

3. **Çıkış yapma:**

   `/users/logout` endpoint'ine POST isteği gönderin.

4. **Ödülleri görüntüleme:**

   `/rewards` endpoint'ine GET isteği gönderin.

5. **Ödül toplama:**

   `/rewards/collect` endpoint'ine `dayIndex` değeri ile POST isteği gönderin.

## Endpointler

### Kullanıcı Endpointleri

1. **Kayıt Ol**

    - **URL:** `/users/register`
    - **Metot:** `POST`
    - **Açıklama:** Yeni kullanıcı kaydeder.
    - **İstek Gövdesi:**
        ```json
        {
          "name": "John Doe",
          "email": "johndoe@example.com",
          "password": "password123"
        }
        ```

2. **Giriş Yap**

    - **URL:** `/users/login`
    - **Metot:** `POST`
    - **Açıklama:** Mevcut kullanıcıyı giriş yapar.
    - **İstek Gövdesi:**
        ```json
        {
          "email": "johndoe@example.com",
          "password": "password123"
        }
        ```

3. **Çıkış Yap**

    - **URL:** `/users/logout`
    - **Metot:** `POST`
    - **Açıklama:** Kullanıcıyı çıkış yapar.

### Ödül Endpointleri

1. **Ödülleri Getir**

    - **URL:** `/rewards`
    - **Metot:** `GET`
    - **Açıklama:** Giriş yapmış kullanıcının ödül bilgilerini getirir.

2. **Ödül Topla**

    - **URL:** `/rewards/collect`
    - **Metot:** `POST`
    - **Açıklama:** Belirtilen gün için ödülü toplar.
    - **İstek Gövdesi:**
        ```json
        {
          "dayIndex": 1
        }
        ```

3. **Günleri Getir**

    - **URL:** `/days`
    - **Metot:** `GET`
    - **Açıklama:** Günlerin ve ödüllerinin listesini getirir.
    - **Yanıt:**
        ```json
        [
          {
            "title": "Day 1",
            "state": 1,
            "claimStartDate": "2024-07-10 22:10:00",
            "claimEndDate": null,
            "coin": 10
          },
          {
            "title": "Day 2",
            "state": 0,
            "claimStartDate": "2024-07-11 00:00:00",
            "claimEndDate": "2024-07-11 23:59:59",
            "coin": 25
          },
          ...
        ]
        ```

## Nasıl Çalışır

1. Kullanıcı sisteme kayıt olur veya giriş yapar.
2. Kullanıcı ödül listesini görüntüleyebilir.
3. Kullanıcı belirtilen gün için ödül toplayabilir.
4. Eğer kullanıcı bir gün ödül toplamazsa, ödüller sıfırlanır ve yeniden başlatılır.
