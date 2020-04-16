<template>
    <div>sale</div>
</template>

<script>
    export default {
        components: {},
        data: {},
        created: function () {
            var a = async () => {
                await console.log('test babel')
            }
        }
    }
</script>

<style>
    .content--wrap {
        -webkit-box-flex: 1;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        max-width: 100%;
        background: #eeeeef !important;
        height: auto;
    }
</style>
