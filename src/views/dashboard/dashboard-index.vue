<template>
  <div class="dashboard-container">
    <!-- <github-corner class="github-corner" /> -->
    <el-row :gutter="40" class="panel-group"> </el-row>
    <el-row :gutter="40" class="card-panel-col">
      <el-col :xs="24" :span="12" :lg="6">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper" style="padding: 0px">
            <el-image
              style="width: 200px; height: 90px"
              :src="imgSrc"
            ></el-image>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Hsy-HsiaoMoon</div>
            <div class="card-panel-text">
              <el-tag size="mini" type="danger">莫得感情</el-tag>
              <el-tag size="mini" type="success" style="margin-left: 5px"
                >打工人</el-tag
              >
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :span="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总访问量</div>
            <count-to
              :start-val="0"
              :end-val="155616"
              :duration="1000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :span="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">支付金额</div>
            <count-to
              :start-val="0"
              :end-val="12299999"
              :duration="1000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :span="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数</div>
            <count-to
              :start-val="0"
              :end-val="1998"
              :duration="1000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="40">
      <el-col :span="6" :xs="24">
        <el-card class="technology-stack">
          <div slot="header" class="clearfix">
            <span>计划事项</span>
          </div>
          <div style="font-size: 14px">
            <todo-list />
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CountTo from "vue-count-to";
@Component({
  name: "Dashboard",
  components: {
    CountTo,
  },
})
export default class Dashboard extends Vue {
  date: Date = new Date();
  nickname = "系统管理员";
  imgSrc = require("@/assets/dashboard.jpg");
  get helloWorld() {
    const hours = this.date.getHours();
    if (hours >= 6 && hours < 8) {
      return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
    } else if (hours >= 8 && hours < 12) {
      return "上午好，" + this.nickname + "！";
    } else if (hours >= 12 && hours < 18) {
      return "下午好，" + this.nickname + "！";
    } else if (hours >= 18 && hours < 24) {
      return "晚上好，" + this.nickname + "！";
    } else if (hours >= 0 && hours < 6) {
      return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
    } else {
      return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .project-brief-introduction {
    .el-divider--horizontal {
      margin: 16px 0;
    }

    .content {
      line-height: 20px;
    }

    margin-bottom: 24px;
  }

  .technology-stack {
    margin-bottom: 24px;
  }

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
    z-index: 99;
  }

  .box-center {
    margin: 0 auto;
    display: table;
  }

  .user-profile {
    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .card-panel-col {
    margin-bottom: 12px;
  }

  .card-panel {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-user {
        background: #e77541;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
