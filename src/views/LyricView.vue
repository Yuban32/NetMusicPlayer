<template>
  <div class="lyric">
    dasdsadasd
  </div>
</template>
<script>
export default {
  name:'LyricView',
  data(){
    return{

    }
  },methods:{
    getLyric(){
      this.axios.get('/lyric?id=33894312').then(re=>{
        console.log(re);
      }).catch(erorr=>{
        console.log(erorr);
      })
    }
  },
  created(){
    this.getLyric()
  }
}
</script>