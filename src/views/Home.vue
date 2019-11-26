<template>
    <div class="home">
        <artAdd></artAdd>
    </div>
</template>
<script>
// @ is an alias to /src
import artAdd from '@/pages/artAdd.vue'

export default {
    name: 'home',
    components: {
        artAdd
    }
}
</script>

<style lang="scss">
	.home{
		width: 100%;
		height: 100%;
	}
</style>