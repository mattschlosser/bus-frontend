<template>
	<div>
		<div class='center'>
			<input type="date" v-model="date"/>
			<input type="time" v-model="time"/>
			<label>
				<input type="checkbox" v-model="electric"/>Electric Buses Only
			</label>
		</div>
	</div>
</template>
<script>
import configs from '../configs'
export default {
    props: {
        for: String
    }, 
    data() {
        return configs[this.for];
    },
}
</script>