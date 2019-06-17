<template>
  <div class="add-contest-warp">
    <el-dialog title="blog" :visible.sync="visible" width="850px">
      <div>
        <div>
          <button class="btn" @click="translateAndPost">translate and post</button>
        </div>
        <div v-html="content"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import utils from '../utils'
export default {
  props: {
    show: {type: Boolean, default: false},
    detail: {type: String, default: ''}
  },
  data: () => ({
    obj: null,
    visible: false,
    blogId: '7732444926663092470',
    contentSource: [],
    content: ''
  }),
  computed: {
    ...mapState(['access_token', 'token_type']),
    ...mapGetters(['isExpires']),
    httpConfig () {
      if (!this.access_token) { return {} }
      return {
        headers: {
          authorization: this.token_type + ' ' + this.access_token
        }
      }
    }
  },
  watch: {
    visible (newV) {
      this.$emit('update:show', newV)
      if (!newV) {
        this.name = ''
      }
    },
    show (newV) {
      this.visible = newV
    },
    detail (newV) {
      if (newV) {
        this.obj = JSON.parse(newV)
        this.getContentSource()
        this.getContent()
      }
    }
  },
  methods: {
    getContentSource () {
      this.contentSource = utils.getContentSource(this.obj)
    },
    getContent () {
      let str = ''
      for (let index in this.contentSource) {
        let target = this.contentSource[index]
        str += target.tpl.replace('{replace-text}', target.text || '')
      }
      this.content = str
    },
    async translateContent () {
      this.content = await utils.translateContent(this.contentSource)
    },
    async translateAndPost () {
      let loading = this.$loading({background: 'rgba(255,255,255,0.5)'})
      await this.translateContent()
      let targetTitle = this.contentSource.find(i => i.type === 'title')
      let title = targetTitle && targetTitle.translateText ? targetTitle.translateText + ' - homestyler' : ''
      await utils.post(this.content, title, this.obj.assetId)
      loading.close()
    }
  }
}
</script>
<style lang="less" scoped>
.cbtn{
  padding: 0 10px;
  border-radius: 4px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
}
.tips{
  height: 20px;
  color: red;
  font-size: 14px;
  line-height: 20px;
}
.btn{
  .cbtn;
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
  // width: 80px;
  background-color: #2e92de;
  &.disable{
    background-color: rgb(204,204,204);
  }
}
</style>
