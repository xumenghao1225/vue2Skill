<style scoped lang="scss">
.table-grid {
  height: 50px;
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-template-rows: 1fr;
  &-left,
  &-right {
    line-height: 50px;
    border: 1px solid #0094ff;
  }
  &-left {
    padding-right: 20px;
    text-align: end;
    border-right: none;
  }
  &-right {
    padding-left: 20px;
    text-align: left;
  }
  &:not(:last-child) {
    .table-grid-right,
    .table-grid-left {
      border-bottom: none;
    }
  }
}
</style>

<template>
  <div>
    <adjustmentResultsGrid :grids="grids"></adjustmentResultsGrid>
    <article>1</article>
    <transferOutAccountTable :data="data">
      <template #empty>
        <p>
          <span>自定义暂无数据</span>
        </p>
      </template>
    </transferOutAccountTable>
  </div>
</template>

<script>
import {
  transferOutAccountTable,
  adjustmentResultsGrid,
} from "@/components/const/Button";
console.log(transferOutAccountTable);
console.log(adjustmentResultsGrid);
export default {
  name: "pageOne",
  components: {
    transferOutAccountTable,
    adjustmentResultsGrid,
  },
  data() {
    return {
      data: [
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
        { id: 12 },
      ],
      grids: [
        { label: "pageTwo", value: "pageOne" },
        { label: "pageTwo", value: "pageOne" },
        { label: "pageTwo", value: "pageOne" },
      ],
    };
  },
};
</script>
