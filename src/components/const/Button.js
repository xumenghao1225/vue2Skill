import { Table, TableColumn } from "element-ui";
const COLUMNS = [
  { name: "id", title: "序号", width: 100, type: "index" },
  { name: "id", title: "计量点编号" },
  { name: "id", title: "用户编码" },
  { name: "id", title: "用户名称" },
  { name: "id", title: "低压落火点GIS标识" },
  { name: "id", title: "电能表标识" },
];
/** 调出户表 */
export const transferOutAccountTable = {
  functional: true,
  name: "transferOutAccountTable",
  render: (h, context) => {
    const { props, scopedSlots = null } = context;
    const { columns = COLUMNS, data } = props;
    return (
      <Table data={data} border={true} center={true} scopedSlots={scopedSlots}>
        {columns.map((item) => {
          if (item.type) {
            return (
              <TableColumn
                align="center"
                width={item.width}
                type={item.type}
                prop={item.name}
                label={item.title}
              ></TableColumn>
            );
          } else {
            return (
              <TableColumn
                align="center"
                prop={item.name}
                label={item.title}
              ></TableColumn>
            );
          }
        })}
        <template slot="empty">
          <div class="custom-empty-slot">
            <p>暂无数据</p>
          </div>
        </template>
      </Table>
    );
  },
};

export const adjustmentResultsGrid = {
  functional: true,
  name: "adjustmentResultsGrid",
  render: (h, context) => {
    const { props } = context;
    const { grids } = props;
    return (
      <section>
        {grids.map((grid) => {
          return (
            <div class="table-grid">
              <div class="table-grid-left">
                <span class="table-grid-left-title">{grid.label}</span>
              </div>
              <div class="table-grid-right">
                <span class="table-grid-right-title">{grid.value}</span>
              </div>
            </div>
          );
        })}
      </section>
    );
  },
};
