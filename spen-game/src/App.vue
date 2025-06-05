<template>
  <div>
    <nav>
      <router-link to="/">O‘yin</router-link> |
      <router-link to="/admin">Admin</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cases: [
        { name: "Black Case", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0GHDC6fHQ1fBdrA8PO4lyKpxpkJ0Xd6Pkz2l7ISiPyes81_febMhbWj-ll8UC_yPYUoU&usqp=CAU", probability: 20 },
        { name: "Gold Case", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEG7HpypnaDKwARdCdqLwHV08AZsQ8Kz1a0SALQi160mBOoVwC4i4HkyLDJBGlgJuXtSI&usqp=CAU", probability: 15 },
        { name: "Red Case", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS024SReloPZV49cd-1uozm7ldbc3iXGyCX6A&s", probability: 25 },
      ],
      keys: [],
      usedKeys: [],
    };
  },
  created() {
    this.generateInitialKeys();
  },
  methods: {
    generateInitialKeys() {
      if (this.keys.length === 0) {
        for (let i = 0; i < 100; i++) {
          const key = `KEY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          this.keys.push(key);
        }
      }
    },
  },
};
</script>

<style scoped>
nav {
  padding: 20px;
  background-color: #2c3e50;
  color: white;
}

router-link {
  margin: 0 10px;
  text-decoration: none;
  color: #3498db;
  font-weight: bold;
}

router-link:hover {
  color: #ffffff;
}

router-link:active {
  color: #2980b9;
}

router-view {
  margin-top: 20px;
  min-height: 400px;
  background-color: #ffffff;
}
</style>