<script>
import { Calendar } from "element-ui";
import DateTable from "./HomeView.vue";

export default {
  extends: Calendar,
  name: "CMCalendar",
  components: {
    DateTable,
  },
};
</script>
<template>
  <Calendar>
    <DateTable></DateTable>
  </Calendar>
</template>
