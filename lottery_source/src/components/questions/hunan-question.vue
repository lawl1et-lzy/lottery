<template>
  <div class="box fh scroll">
    <div class="form">
        <p class="biaoti">公益彩票进卷烟零售店调查问卷表</p>
        <p>尊敬的卷烟零售客户</p>
        <p>您好！</p>
        <p class="page1">
            长期以来，在烟草行业各级部门的共同努力下，广大烟草零售客户与行业建立了平等互利、长期合作、共同发展的关系，形成了战略共同体、目标共同体和利益共同体。面对零售业态的新挑战，我们以提升客户盈利为根本出发点，推出先票后款、免设备押金、免配送费的公益彩票增值服务。经行业双方协商，现对我行业持有烟草专卖许可证客户开通“售彩快速通道”。</p>
        <p class="page2">本着以维护零售客户利益、消费者利益为宗旨，特展开此调查意向表，感谢您的参与配合！</p>
        <div class="info">
            <div class="q-item">
                <p>1、 您拥有卷烟销售许可证多长时间了？</p>
                <label >
                    <input type="radio" required name="answer[73]" value="10年以上">&nbsp;&nbsp;10年以上
                </label>
                <label>
                    <input type="radio"  name="answer[73]" value="5-9年">&nbsp;&nbsp;5-9年
                </label>
                <label>
                    <input type="radio"  name="answer[73]" value="3-5年">&nbsp;&nbsp;3-5年
                </label>
                <label>
                    <input type="radio"  name="answer[73]" value="其他">&nbsp;&nbsp;其他
                </label>
            </div>
        </div>
        <div class="info">
            <div class="q-item">
                <p>2、 您店里卷烟月销售量是多少？</p>
                <label>
                    <input type="radio" required name="answer[74]" value="300条以上">&nbsp;&nbsp;300条以上
                </label>
                <label>
                    <input type="radio"  name="answer[74]" value="200-300条">&nbsp;&nbsp;200-300条
                </label>
                <label>
                    <input type="radio"  name="answer[74]" value="100-200条">&nbsp;&nbsp;100-200条
                </label>
                <label>
                    <input type="radio"  name="answer[74]" value="其他">&nbsp;&nbsp;其他
                </label>
            </div>
        </div>
        <div class="info">
            <div class="q-item">
                <p>3、 您店里卷烟销售占总店销售额多少？</p>
                <label>
                    <input type="radio" required name="answer[75]" value="50%以上">&nbsp;&nbsp;50%以上
                </label>
                <label>
                    <input type="radio"  name="answer[75]" value="30%－50%">&nbsp;&nbsp;30%－50%
                </label>
                <label>
                    <input type="radio"  name="answer[75]" value="10%-30%">&nbsp;&nbsp;10%-30%
                </label>
                <label>
                    <input type="radio"  name="answer[75]" value="其他">&nbsp;&nbsp;其他
                </label>
            </div>
        </div>
        <!-- <div class="info">
            <div class="q-item">
                <p>4、 先货后款， 免机器设备押金， 保底8%的毛利率，您想不想卖即开型彩票？</p>
                <label>
                    <input type="radio" required name="answer[76]" value="想">&nbsp;&nbsp;想
                </label>
                <label>
                    <input type="radio"  name="answer[76]" value="不想">&nbsp;&nbsp;不想
                </label>
            </div>
        </div> -->
        <div class="info">
            <div class="q-item">
                <p>4、 返奖率高达65%，活动多，例如赠送金条活动， 还有奖上奖，您想不想卖即开型彩票？</p>
                <label>
                    <input type="radio" required name="answer[77]" value="想">&nbsp;&nbsp;想
                </label>
                <label>
                    <input type="radio" name="answer[77]" value="不想">&nbsp;&nbsp;不想
                </label>
            </div>
        </div>
        <div class="info">
            <div class="q-item">
                <p>5、 您想不想在销售即开型彩票的同时增加额外奖励？（如：日销售冠军、周销售冠军、月销售冠军）</p>
                <label>
                    <input type="radio" required name="answer[78]" value="想">&nbsp;&nbsp;想
                </label>
                <label>
                    <input type="radio"  name="answer[78]" value="不想">&nbsp;&nbsp;不想
                </label>
            </div>
        </div>
        <div class="btn-wrapper">
            <button class="tijiao"  @click="submitData">提交</button>
        </div>
    </div>
  </div>
</template>

<script>
import {api} from '../../public/api'
export default {
  name: "hunan",
  data() {
    return {
      submiting: false
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    submitData() {
      if (this.submiting) {
        return
      }
      let reqData = {
        "answer[73]": this.getData("answer[73]"),
        "answer[74]": this.getData("answer[74]"),
        "answer[75]": this.getData("answer[75]"),
        // "answer[76]": this.getData("answer[76]"),
        "answer[77]": this.getData("answer[77]"),
        "answer[78]": this.getData("answer[78]")
      };

      for (let key in reqData) {
        if (!reqData[key]) {
          alert("请完成问卷调查表");
          return;
        }
      }
      this.submiting = true;
      api.request("mobile/register/modifyQuestions", reqData)
        .then(res => {
          if (!res.code && res.indexOf("注册成功，店铺审核中！") > 0) {
            alert("注册成功，店铺审核中！");
            this.$router.push({ name: "shopinfo" });
          } else if (res.code != 0) {
            alert(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(() => {
          this.submiting = false;
        });
    },
    getInitData() {
      api.request("mobile/Register/getQuestion").then(res => {
        if (res.code == 0) {
          this.bindData("answer[73]", res.data[1]);
          this.bindData("answer[74]", res.data[2]);
          this.bindData("answer[75]", res.data[3]);
          // this.bindData("answer[76]", res.data[4]);
          this.bindData("answer[77]", res.data[5]);
          this.bindData("answer[78]", res.data[6]);
        }
      });
    },
    bindData(name, data) {
      if (!data) {
        return;
      }
      let inputs = document.getElementsByName(name);
      for (let item of inputs) {
        if (item.value == data) {
          item.checked = true;
          break;
        }
      }
    },
    getData(name) {
      let radios = document.getElementsByName(name);
      let value = "";
      for (let item of radios) {
        if (item.checked) {
          value = item.value;
          break;
        }
      }
      return value;
    }
  }
};
</script>

<style scoped>
html {
  background-color: #ffffff;
  font-size: 14px;
}

.box {
  width: 90%;
  margin: 20px auto 0;
}

.page1,
.page2 {
  text-indent: 2em;
}

.info {
  margin: 10px 0;
}

.info p {
  float: none;
}

.tijiao {
  display: block;
  width: 100%;
  border: none;
  cursor: none;
  background-color: #2a6853;
  text-align: center;
  color: #fff;
  padding: 5px 0;
  font-size: 16px;
  margin: 30px 0;
}

label {
  margin-right: 5px;
  font-weight: 400;
  color: black;
}

.form {
  font-size: 14px;
  line-height: 16px;
}

p {
  color: black;
}

span {
  color: black;
}

.biaoti {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
}
</style>
