// SVGO is a build/asset tool: the editable source SVG in src/svg/ remains
// authoritative. Optimized output (npm run svg:optimize) is generated output
// only. Semantic group IDs and group structure must never be destroyed.
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          collapseGroups: false,
          moveGroupAttrsToElems: false,
          removeUselessDefs: false,
        },
      },
    },
  ],
}
