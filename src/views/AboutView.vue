<script>
import { Calendar } from "element-ui";
import DateTable from "./HomeView.vue";

export default {
  name: "CMCalendar",
  components: {
    DateTable,
    Calendar,
  },
};
</script>
<template>
  <Calendar>
    <DateTable></DateTable>
  </Calendar>
</template>
