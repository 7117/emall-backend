<template>
    <div class="login_container">
        <div class="login_box"></div>
    </div>
</template>>

<script>
export default {
    
}
</script>

// scoped 样式只在当前组件生效
// lang支持less语法
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width:450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left:50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
</style>