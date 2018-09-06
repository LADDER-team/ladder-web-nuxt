export default async (context) => {
  await context.store.dispatch('clientInit', context)
}
