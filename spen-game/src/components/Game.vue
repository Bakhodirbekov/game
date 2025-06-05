<template>
  <div class="container-fluid min-h-screen text-white relative overflow-hidden">
    <!-- Orqa fon -->
    <div class="background-overlay"></div>
    <div class="relative z-10 p-4">
      <!-- Sarlavha -->
      <h1 class="text-5xl md:text-6xl font-extrabold text-center mb-10 text-neon-blue animate-pulse">
        Open Cases
      </h1>

      <!-- User Info -->
      <div class="row justify-content-center mb-5" v-if="username">
        <div class="col-md-8">
          <div class="card bg-dark text-white border-neon-green shadow-lg">
            <div class="card-body d-flex align-items-center justify-content-center">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" class="case-icon w-8 h-8 mr-3" alt="case" />
              <p class="mb-0 text-lg md:text-xl">
                <span class="text-gray-300">{{ username }}</span> - 
                <span class="text-neon-green font-bold">Yutgan sovg‘alar: {{ wins }}</span> | 
                <span class="text-neon-blue font-bold">Qolgan key’lar: {{ remainingKeys }}</span> | 
                <span class="text-neon-yellow font-bold">Online: {{ $root.onlineUsers || 0 }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="row justify-content-center mb-5">
        <div class="col-md-6">
          <div class="card bg-dark text-white border-neon-blue shadow-lg">
            <div class="card-body">
              <input
                v-model="usernameInput"
                placeholder="Ismingizni kiriting"
                class="form-control bg-dark text-white border-0 placeholder-gray-400 focus:ring-2 focus:ring-neon-blue mb-3"
              />
              <button
                @click="register"
                class="btn btn-primary w-100 bg-neon-blue hover:bg-blue-700 transition-all duration-300"
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- O'yin tugagan xabar -->
      <div v-if="gameOver" class="row justify-content-center mb-5">
        <div class="col-md-6">
          <div class="card bg-dark text-white border-neon-red shadow-lg">
            <div class="card-body text-center">
              <p class="text-xl md:text-2xl text-neon-red font-bold">O‘yin tugadi! Barcha key’lar ishlatildi.</p>
              <button
                @click="resetGame"
                class="btn btn-primary w-100 bg-neon-blue hover:bg-blue-700 transition-all duration-300 mt-3"
              >
                O‘yinni qayta boshlash
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Itemlar -->
      <div class="row row-cols-1 row-cols-md-3 g-4 mb-5" v-if="username && !gameOver">
        <div v-for="(item, index) in premiumItems" :key="index" class="col">
          <div class="card bg-dark border-neon-green shadow-lg h-100 transition-all duration-300 hover:scale-105">
            <img :src="item.image" :alt="item.name" class="card-img-top p-3" style="height: 200px; object-fit: contain;" />
            <div class="card-body text-center">
              <h5 class="card-title text-neon-green">{{ item.name }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- Token va Spin -->
      <div class="row justify-content-center mb-5" v-if="username && !gameOver">
        <div class="col-md-6">
          <div class="card bg-dark text-white border-neon-green shadow-lg">
            <div class="card-body">
              <input
                v-model="token"
                placeholder="Token kiriting (masalan: KJI04-EGJVQ2P7)"
                class="form-control bg-dark text-white border-0 placeholder-gray-400 focus:ring-2 focus:ring-neon-green mb-3"
              />
              <button
                @click="spin"
                :disabled="!canSpin"
                class="btn btn-success w-100 bg-neon-green hover:bg-green-700 transition-all duration-300 text-uppercase font-bold"
                :class="{ 'disabled': !canSpin }"
              >
                Spin!
              </button>
              <button
                v-if="showRetry"
                @click="retrySpin"
                class="btn btn-warning w-100 bg-neon-yellow hover:bg-yellow-700 transition-all duration-300 mt-3 text-uppercase font-bold"
              >
                Qayta urinib ko‘rish
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Roulette -->
      <div class="roulette-container mb-5" v-if="canSpin">
        <div class="roulette-inner d-flex transition-transform duration-5000 ease-in-out" :style="{ transform: `translateX(${offset}px)` }">
          <div
            v-for="(item, index) in rouletteItems"
            :key="index"
            class="roulette-item flex-shrink-0 d-flex align-items-center justify-content-center"
            :class="{ 'selected-item': index === Math.floor(rouletteItems.length / 2) }"
          >
            <div class="roulette-item-image rounded-circle border-neon-green shadow-md">
              <img :src="item.image" alt="case" class="w-100 h-100 object-contain rounded-circle" />
            </div>
            <span class="d-none">{{ item.name }}</span>
          </div>
        </div>
        <div class="pointer"></div>
      </div>

      <!-- Key ochilish animatsiyasi -->
      <div v-if="showKeyAnimation" class="modal-backdrop show d-flex align-items-center justify-content-center">
        <div class="modal-content bg-dark text-white border-neon-green shadow-lg animate-open">
          <div class="modal-body text-center">
            <div class="key-image bg-dark rounded-lg border-2 border-neon-blue shadow-md mb-4">
              <img :src="selectedKey.image" alt="key" class="w-100 h-100 object-contain rounded-lg" />
            </div>
            <button
              @click="openGift"
              class="btn btn-danger w-100 bg-neon-red hover:bg-red-700 transition-all duration-300"
            >
              Keyni ochish!
            </button>
          </div>
        </div>
      </div>

      <!-- Sovg'a chiqish animatsiyasi -->
      <div v-if="showGiftAnimation" class="modal-backdrop show d-flex align-items-center justify-content-center">
        <div class="modal-content bg-dark text-white border-neon-green shadow-lg animate-pop">
          <div class="modal-body text-center">
            <div class="gift-image bg-dark rounded-lg border-2 border-neon-blue shadow-md mb-4">
              <img :src="selectedGift.image" alt="gift" class="w-100 h-100 object-contain rounded-lg" />
            </div>
            <p class="text-2xl font-bold text-neon-green mb-4 animate-pulse">{{ selectedGift.name }}</p>
            <button
              @click="closeGiftAnimation"
              class="btn btn-primary w-100 bg-neon-blue hover:bg-blue-700 transition-all duration-300"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>

      <!-- Items in Case -->
      <div class="mt-5" v-if="username && !gameOver">
        <h2 class="text-2xl text-white uppercase tracking-wide mb-4 text-center border-l-4 border-r-4 border-neon-orange inline-block px-4">Items in Case:</h2>
        <div class="row row-cols-2 row-cols-md-4 g-4">
          <div v-for="(item, index) in otherItems" :key="index" class="col">
            <div class="card bg-dark border-neon-blue shadow-lg h-100 transition-all duration-300 hover:scale-105">
              <img :src="item.image" :alt="item.name" class="card-img-top p-3" style="height: 150px; object-fit: contain;" />
              <div class="card-body text-center">
                <h5 class="card-title text-neon-blue">{{ item.name }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Natija -->
      <p class="text-center text-2xl md:text-3xl font-bold text-neon-green mt-5 animate-bounce" v-if="!showKeyAnimation && !showGiftAnimation">{{ result }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data() {
    return {
      offset: 0,
      result: "Sovg‘angizni bu yerda ko‘rasiz...",
      token: "",
      rouletteItems: [],
      usernameInput: "",
      username: localStorage.getItem("username") || "",
      wins: parseInt(localStorage.getItem("wins") || "0"),
      hasSpun: false,
      showRetry: false,
      showKeyAnimation: false,
      showGiftAnimation: false,
      selectedKey: null,
      selectedGift: null,
      premiumItems: [
        {
          name: "Hyper Beast",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=Five-SeveN+Hyper+Beast+CSGO+skin&tbm=isch",
        },
        {
          name: "Stiletto Knife Marble Fade",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=Stiletto+Knife+Marble+Fade+CSGO+skin&tbm=isch",
        },
        {
          name: "M4A1-S Decimator",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-2oLhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=M4A1-S+Decimator+CSGO+skin&tbm=isch",
        },
      ],
      otherItems: [
        {
          name: "MAC-10 Fade",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=MAC-10+Fade+CSGO+skin&tbm=isch",
        },
        {
          name: "MP9 Dark Age",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=MP9+Dark+Age+CSGO+skin&tbm=isch",
        },
        {
          name: "AK-47 Case Hardened",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZ11HTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV4N2lnYXmwPTP7LZnX9Q5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=AK-47+Case+Hardened+CSGO+skin&tbm=isch",
        },
        {
          name: "AWP Graphite",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=AWP+Graphite+CSGO+skin&tbm=isch",
        },
        {
          name: "Dual Berettas Twin Turbo",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=Dual+Berettas+Twin+Turbo+CSGO+skin&tbm=isch",
        },
        {
          name: "Glock-18 Twilight Galaxy",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=Glock-18+Twilight+Galaxy+CSGO+skin&tbm=isch",
        },
        {
          name: "M4A1-S Decimator",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-2oLhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=M4A1-S+Decimator+CSGO+skin&tbm=isch",
        },
        {
          name: "M4A4 Desolate Space",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-2oLhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=M4A4+Desolate+Space+CSGO+skin&tbm=isch",
        },
        {
          name: "MP9 Hydra",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          googleLink: "https://www.google.com/search?q=MP9+Hydra+CSGO+skin&tbm=isch",
        },
      ],
    };
  },
  computed: {
    canSpin() {
      return this.username && !this.hasSpun && this.token && !this.$root.usedKeys.includes(this.token) && !this.gameOver;
    },
    remainingKeys() {
      return this.$root.keys.length - this.$root.usedKeys.length;
    },
    gameOver() {
      return this.remainingKeys === 0;
    },
  },
  mounted() {
    this.populateRoulette();
    if (this.$root.keys.length > 0 && !this.$root.keyGifts) {
      this.initializeGifts();
    }
    if (this.username) {
      if (!this.$root.onlineUsers) this.$root.onlineUsers = 0;
      this.$root.onlineUsers += 1;
    }
    this.heartbeatInterval = setInterval(() => {
      if (this.username) {
        console.log(`${this.username} hali online`);
      }
    }, 10000);
  },
  beforeUnmount() {
    if (this.username && this.$root.onlineUsers > 0) {
      this.$root.onlineUsers -= 1;
    }
    clearInterval(this.heartbeatInterval);
  },
  methods: {
    populateRoulette() {
      this.rouletteItems = [];
      const cases = [
        {
          name: "Danger Zone Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
        {
          name: "Prisma Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
        {
          name: "Free CSGO Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
        {
          name: "Danger Zone Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
        {
          name: "Prisma Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
      ];
      for (let i = 0; i < 20; i++) {
        this.rouletteItems.push(cases[i % cases.length]);
      }
    },
    register() {
      if (this.usernameInput.trim()) {
        this.username = this.usernameInput.trim();
        localStorage.setItem("username", this.username);
        this.usernameInput = "";
        this.wins = 0;
        localStorage.setItem("wins", this.wins);
        this.showRetry = false;
        this.showKeyAnimation = false;
        this.showGiftAnimation = false;
        if (!this.$root.onlineUsers) this.$root.onlineUsers = 0;
        this.$root.onlineUsers += 1;
      }
    },
    initializeGifts() {
      const bigGifts = [
        {
          name: "AWP | Dragon Lore",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-tOeQdiDxJ_7hU7HUKW4m5Os37dTngf3mlB5qV2V2d9cS3A_1u1e6_1K5xOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=AWP+Dragon+Lore+CSGO+skin&tbm=isch",
        },
        {
          name: "Karambit | Fade",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=Karambit+Fade+CSGO+skin&tbm=isch",
        },
        {
          name: "M4A4 | Howl",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-2oLhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=M4A4+Howl+CSGO+skin&tbm=isch",
        },
        {
          name: "AK-47 | Fire Serpent",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV4N2lnYXmwPTP7LZnX9Q5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=AK-47+Fire+Serpent+CSGO+skin&tbm=isch",
        },
        {
          name: "Glock-18 | Fade",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=Glock-18+Fade+CSGO+skin&tbm=isch",
        },
        {
          name: "Desert Eagle | Blaze",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLFTeRj7eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=Desert+Eagle+Blaze+CSGO+skin&tbm=isch",
        },
        {
          name: "M9 Bayonet | Crimson Web",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=M9+Bayonet+Crimson+Web+CSGO+skin&tbm=isch",
        },
        {
          name: "P90 | Asiimov",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=P90+Asiimov+CSGO+skin&tbm=isch",
        },
        {
          name: "USP-S | Kill Confirmed",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopkieLhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=USP-S+Kill+Confirmed+CSGO+skin&tbm=isch",
        },
        {
          name: "Five-SeveN | Hyper Beast",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLhFf0Ob3cz5N08i3n4mGxfHnJ4Tdn2xZ_Pp8j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 5,
          type: "big",
          googleLink: "https://www.google.com/search?q=Five-SeveN+Hyper+Beast+CSGO+skin&tbm=isch",
        },
      ];

      const smallGifts = [
        {
          name: "P250 | Sand Dune",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=P250+Sand+Dune+CSGO+skin&tbm=isch",
        },
        {
          name: "Tec-9 | Red Slide",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=Tec-9+Red+Slide+CSGO+skin&tbm=isch",
        },
        {
          name: "MP9 | Bioleak",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=MP9+Bioleak+CSGO+skin&tbm=isch",
        },
        {
          name: "MAG-7 | Cobalt Core",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=MAG-7+Cobalt+Core+CSGO+skin&tbm=isch",
        },
        {
          name: "FAMAS | Djinn",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=FAMAS+Djinn+CSGO+skin&tbm=isch",
        },
        {
          name: "P2000 | Ivory",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=P2000+Ivory+CSGO+skin&tbm=isch",
        },
        {
          name: "Sawed-Off | Yorick",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=Sawed-Off+Yorick+CSGO+skin&tbm=isch",
        },
        {
          name: "Nova | Candy Apple",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1LhRfwPz3fzxU9eO6nYeDg7X4MpnZmmhQ5dZ0j-3A2A3t-hY4a2H1d9fGdwA6aA7U_1K5kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 10,
          type: "small",
          googleLink: "https://www.google.com/search?q=Nova+Candy+Apple+CSGO+skin&tbm=isch",
        },
      ];

      const allGifts = [...bigGifts, ...smallGifts];
      this.$root.gifts = allGifts;
      this.$root.keyGifts = {};

      this.$root.keys.forEach((key, index) => {
        const giftIndex = Math.floor(Math.random() * allGifts.length);
        this.$root.keyGifts[key] = allGifts[giftIndex];
      });

      this.$root.cases = [
        {
          name: "Danger Zone Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
        {
          name: "Prisma Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
        {
          name: "Free CSGO Case",
          image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0H3G1R1uJQ0SLLXB6iGIbE_c1bZ7P7kVRJ97dOJxKMmPK6Y7rDhG4A6cTq2--Y3Njm0U5lJQDdQJ7nV1z5M1rS_0Vv4kOa-0c7v0c7PzyFl7CQtaz2LnBLl0hxOaOaL0vS0hM4/360fx360f",
          probability: 20,
        },
      ];

      this.$root.cases.forEach((caseItem, index) => {
        caseItem.associatedGift = allGifts[index % allGifts.length];
      });
    },
    spin() {
      if (!this.canSpin) {
        this.result = "Noto‘g‘ri key kiritdingiz yoki o‘yin imkoniyati tugadi!";
        return;
      }

      const usedKeys = this.$root.usedKeys;
      if (!this.token || usedKeys.includes(this.token)) {
        this.result = "Noto‘g‘ri yoki ishlatilgan token! Yangi token kiriting.";
        return;
      }

      const cases = this.$root.cases;
      const randomOffset = Math.floor(Math.random() * (cases.length * 100)) + 1000;
      this.offset = -randomOffset;

      setTimeout(() => {
        const totalProbability = cases.reduce((sum, c) => sum + c.probability, 0);
        let random = Math.random() * totalProbability;
        let selectedCase = null;

        for (let i = 0; i < cases.length; i++) {
          random -= cases[i].probability;
          if (random <= 0) {
            selectedCase = cases[i];
            break;
          }
        }
        if (!selectedCase) selectedCase = cases[cases.length - 1];

        this.selectedKey = { image: "https://cdn-icons-png.flaticon.com/512/1532/1532495.png", name: this.token };
        this.selectedGift = this.$root.keyGifts[this.token] || selectedCase.associatedGift;
        this.offset = 0;
        this.$root.usedKeys.push(this.token);
        this.token = "";
        this.hasSpun = true;
        this.showKeyAnimation = true;
        this.showRetry = true;
      }, 5000);
    },
    openGift() {
      this.showKeyAnimation = false;
      this.showGiftAnimation = true;
      this.wins += 1;
      localStorage.setItem("wins", this.wins);
    },
    closeGiftAnimation() {
      this.showGiftAnimation = false;
      this.result = `Sizga tushdi: ${this.selectedGift.name}!`;
    },
    retrySpin() {
      this.hasSpun = false;
      this.showRetry = false;
      this.showKeyAnimation = false;
      this.showGiftAnimation = false;
      this.result = "Sovg‘angizni bu yerda ko‘rasiz...";
    },
    resetGame() {
      this.$root.usedKeys = [];
      this.wins = 0;
      localStorage.setItem("wins", this.wins);
      this.hasSpun = false;
      this.showRetry = false;
      this.showKeyAnimation = false;
      this.showGiftAnimation = false;
      this.result = "Sovg‘angizni bu yerda ko‘rasiz...";
    },
  },
};
</script>

<style lang="scss" scoped>
// SCSS uslublari
$neon-blue: #00ffff;
$neon-green: #00ff00;
$neon-red: #ff0000;
$neon-yellow: #ffff00;
$neon-orange: #ff4500;

body {
  font-family: 'Montserrat', sans-serif;
}

.container-fluid {
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  inset: 0;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center;
  background-size: cover;
  filter: blur(5px);
  opacity: 0.3;
  z-index: 0;
}

.card {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.roulette-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.9);
  border: 4px solid $neon-green;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 20px $neon-green;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.roulette-inner {
  display: flex;
  transition: transform 5s ease-in-out;
}

.roulette-item {
  flex: 0 0 120px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}

.roulette-item-image {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $neon-green;
  box-shadow: 0 0 10px $neon-green;
  background: rgba(0, 0, 0, 0.8);
}

.selected-item {
  .roulette-item-image {
    border: 4px solid $neon-red;
    box-shadow: 0 0 15px $neon-red;
  }
}

.pointer {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 40px solid $neon-red;
  z-index: 10;
}

.modal-backdrop {
  background: rgba(0, 0, 0, 0.9);
  z-index: 20;
}

.modal-content {
  background: rgba(0, 0, 0, 0.8);
  border: 4px solid $neon-green;
  border-radius: 15px;
  box-shadow: 0 0 20px $neon-green;
  padding: 20px;
}

.key-image, .gift-image {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes openKey {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes popGift {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(5deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

// Tailwind CSS kengaytmalari
@layer utilities {
  .border-neon-green {
    border-color: $neon-green;
    box-shadow: 0 0 10px $neon-green, 0 0 20px $neon-green;
  }
  .border-neon-blue {
    border-color: $neon-blue;
    box-shadow: 0 0 10px $neon-blue, 0 0 20px $neon-blue;
  }
  .border-neon-red {
    border-color: $neon-red;
    box-shadow: 0 0 10px $neon-red, 0 0 20px $neon-red;
  }
  .border-neon-orange {
    border-color: $neon-orange;
    box-shadow: 0 0 10px $neon-orange, 0 0 20px $neon-orange;
  }
  .text-neon-blue {
    color: $neon-blue;
    text-shadow: 0 0 5px $neon-blue, 0 0 10px $neon-blue, 0 0 15px $neon-blue;
  }
  .text-neon-green {
    color: $neon-green;
    text-shadow: 0 0 5px $neon-green, 0 0 10px $neon-green, 0 0 15px $neon-green;
  }
  .text-neon-red {
    color: $neon-red;
    text-shadow: 0 0 5px $neon-red, 0 0 10px $neon-red, 0 0 15px $neon-red;
  }
  .text-neon-yellow {
    color: $neon-yellow;
    text-shadow: 0 0 5px $neon-yellow, 0 0 10px $neon-yellow, 0 0 15px $neon-yellow;
  }
  .bg-neon-blue {
    background-color: $neon-blue;
  }
  .bg-neon-green {
    background-color: $neon-green;
  }
  .bg-neon-red {
    background-color: $neon-red;
  }
  .bg-neon-yellow {
    background-color: $neon-yellow;
  }
  .text-uppercase {
    text-transform: uppercase;
  }
}
</style>