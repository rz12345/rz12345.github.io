<template>
    <ul class="list-group list-group-root well">
        <li class="list-group-item list-group-item-action" data-toggle="collapse" v-for="i in
              item_classes" :key="i" v-on:click="isActive = !isActive" v-bind:class="{ 'active': isActive }">
            <i class="fas fa-plus"></i> {{ i.item_class_name }}
        </li>
    </ul>
</template>

<script>
module.exports = {
    data: function () {
        return {
            isActive: false,
        };
    },
    props: ['item_classes'],
}
</script>
