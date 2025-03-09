import {computed, Comment, Fragment, Text, type VNodeArrayChildren, isVNode} from 'vue'

export default function (slot: undefined | (() => any)) {
  function vNodeIsEmpty (vnodes: VNodeArrayChildren): boolean {
    return vnodes.every(node => {
      if (!isVNode(node)) return true
      if (node.type === Comment) return true
      if (node.type === Text && typeof node.children === 'string' && !node.children.trim()) return true
      return node.type === Fragment &&
        vNodeIsEmpty(node.children as VNodeArrayChildren);
    })
  }

  return {
    isSlotEmpty: computed(() => slot ? vNodeIsEmpty(slot()) : true)
  }
}
