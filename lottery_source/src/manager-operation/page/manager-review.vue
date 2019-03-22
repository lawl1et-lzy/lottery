<template>
  <div class="container no-scroll">
    <mt-navbar v-model="selected" class="bb">
      <mt-tab-item id="undone">待审核</mt-tab-item>
      <mt-tab-item id="done">已通过</mt-tab-item>
      <mt-tab-item id="refuse" >已拒绝</mt-tab-item>
    </mt-navbar>
   <mt-tab-container class="container scroll pb-108" 
      v-model="selected" 
      :swipeable="false"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="noMore"
      infinite-scroll-distance="10">
      <mt-tab-container-item id="undone">
        <review-list :list="undone" :type="'undone'" @selectedItem="selectedItem($event)"></review-list>
      </mt-tab-container-item>
      <mt-tab-container-item id="done" >
        <review-list :list="done" :type="'done'" @selectedItem="selectedItem($event)"></review-list>
      </mt-tab-container-item>
      <mt-tab-container-item id="refuse">
        <review-list :list="refuse" :type="'refuse'" @selectedItem="selectedItem($event)"></review-list>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import reviewList from '../components/review-list'
export default {
  components: {
    reviewList
  },
  name: 'manager-review',
  data: function() {
    return {
    };
  },
  created() {
    var currentPage = localStorage.getItem('currentPage');
    if(currentPage) {
      this.selected = currentPage
    }
    localStorage.setItem('currentPage',this.selected);
    if(!this[this.selected].length) {
      this.$store.dispatch('updateData')
    }
  },
  computed: {
    selected: {
      get() {
        return this.$store.state.check.currentPage;
      },
      set(v) {
        if (this.$store.state.check.currentPage == v || this.isLoading) {
          return;
        }
        localStorage.setItem('currentPage',v);
        this.$store.commit('changeActive', v)
        this.$store.dispatch('updateData')
      }
    },
    undone () {
      return this.$store.state.check.undone.list;
    },
    done() {
       return this.$store.state.check.done.list;
    },
    refuse() {
      return this.$store.state.check.refuse.list;
    },
    isEmpty() {
      return this.$store.getters.isEmpty
    },
    noMore(){
       return this.$store.getters.noMore
    },
    isLoading() {
      return this.$store.state.check.isLoading
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('loadMore')
    },
    selectedItem(item) {
      let id = item.id
      if(this.selected === 'refuse') {
        id = item.recordId
      }
      this.$router.push({path:'/review-info',query:{id: id}})
    }
  },
}
</script>

<style scoped>
  .pb-108{
    padding-bottom: 108px;
  }
</style>