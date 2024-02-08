<template>
  <div id="app">
    <Board :state="state.board" />
  </div>
</template>

<script>
import Board from "./components/Board.vue";
import axios from "axios";
import { reactive } from "vue";

export default {
  name: "App",
  components: {
    Board,
  },

  setup() {
    const state = reactive({
      weather: {
        weather: "비",
        curr_temp: 1,
        highest_temp: 2,
        lowest_temp: 0,
      },
    });
    axios.get("/api/weather").then((res) => {
      state.weather = res.data;
    });

    return {
      state,
    };
  },
};
</script>