<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group" gap="12">
      <el-col :xs="24" :span="24" :lg="24" class="card-panel-col">
        <el-card shadow="never" :body-style="bodyStyle">
          {{ helloWorld }}
        </el-card>
      </el-col>
    </el-row>
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
  bodyStyle = {
    padding: "30px 20px",
  };
  get helloWorld() {
    const hours = this.date.getHours();
    if (hours >= 6 && hours < 8) {
      return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
    } else if (hours >= 8 && hours < 12) {
      return "😀上午好，" + this.nickname + "！";
    } else if (hours >= 12 && hours < 18) {
      return "🕒下午好，" + this.nickname + "！";
    } else if (hours >= 18 && hours < 24) {
      return "🌙晚上好，" + this.nickname + "！";
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
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
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
