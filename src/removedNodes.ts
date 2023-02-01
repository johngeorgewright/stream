export function removedNodes() {
  return new TransformStream<MutationRecord, Node>({
    transform({ removedNodes }, controller) {
      for (let i = 0; i < removedNodes.length; i++)
        controller.enqueue(removedNodes[i])
    },
  })
}
