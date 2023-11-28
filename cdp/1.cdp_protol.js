const CDP = require('chrome-remote-interface');

async function test() {
  let client;
  try {
    client = await CDP({ host: '127.0.0.1', port: 9222 });
    const { Page, DOM, Debugger, CSS ,Profiler} = client;

    const cssMap = new Map();
    const jsMap = new Map();

    await Page.enable();
    await Debugger.enable();
    await DOM.enable();
    await CSS.enable();
    await Profiler.enable();

    await CSS.startRuleUsageTracking();
    await Profiler.startPreciseCoverage()


    CSS.on('styleSheetAdded', async (event) => {
      const styleSheetId = event.header.styleSheetId;
      const content = await CSS.getStyleSheetText({ styleSheetId });

      cssMap.set(styleSheetId, {
        meta: event.header,
        content: content.text,
      });
    });
    Debugger.on('scriptParsed', async (event) => {
      const scriptId = event.scriptId;
      const content = await Debugger.getScriptSource({ scriptId });

      jsMap.set(scriptId, {
        meta: event,
        content: content.scriptSource,
      });
    });

    await Page.navigate({ url: 'http://127.0.0.1:8084' });


    await new Promise((resolve) => setTimeout(resolve, 3000));


    // cssCoverage 是使用的 css部分
    const cssCoverage = await CSS.stopRuleUsageTracking();
    // cssMap.get('style-sheet-94023-2').content.slice(46,74)

    // jsCoverage 是使用的 js部分
    const jsCoverage = await Profiler.takePreciseCoverage()
    debugger

  } catch (err) {
    console.error(err);
  }
}
test();
