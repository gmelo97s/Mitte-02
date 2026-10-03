import Index from "./pages/Index";

/**
 * Site de página única — sem router. Assim o build roda na raiz de um domínio,
 * num subdiretório (GitHub Pages) ou embutido, sem rewrite nem basename no host.
 */
const App = () => <Index />;

export default App;
