import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

const Trocas = {
  asasul: 10913233033,
  ataulfo:1735705697,
  barra: 3129541712,
  batel: 7345013736,
  centro: 2035258714,
  gavea: 6265002735,
  ipanema: 3129534163,
  leblon:4544338668,
  niteroi: 6882480397,
  riosul: 462207962,
  tijuca: 5817204615,
  itaim: 5212318974,
  pinheiros: 2166663399,
  villalobos: 2172544052,
  haddocklobo: 3028540350,
  savassi: 3440805561,
  barrashopping: 3446161344,
  moinhos: 7389516845,
  higienopolis:1701727429,
  ibirapuera:7322782528,
  cambui:8408706763,
  salvador:8397215332,
  fortaleza: 9733759457,
  poa:11244007970,
  icarai:5390200220,
  barigui:2431543317,
  riosulII: 8448360139,
  eldorado: 9626733780

};

const Td = ({ children }) => <td style={{ border: "1px solid black", padding: "6px" }}>{children}</td>

const Tdb = ({ children }) => <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>{children}</td>

export default function Home() {
  const router = useRouter()
  const { store } = router.query

  const [result, setResult] = useState({} as any);
  const [total, setTotal] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [cupons, setCupons] = useState([] as any);
  const [pagamentos, setPagamentos] = useState({} as any);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      const monthPadded = (date.getMonth() + 1).toString().padStart(2, "0");
      const res = await fetch(`/api/zerezes${store}?date=${date.getDate()}-${monthPadded}-${date.getFullYear()}`);
      const json = await res.json();
      setCupons(json.cupons);
      

      const result = {};
      let total = 0;
      let total2 = 0;
      const pags = {};

      for (let i = 0; i < json.cupons.length; i++) {
        const cupom = json.cupons[i];
        total2 += cupom.cabecalhoCupom.nValorCupom;

        let flanela = { nQuant: 0, vUnit: 0 };
        let estojo = { nQuant: 0, vUnit: 0 };
        let ecobag = { nQuant: 0, vUnit: 0 };
        let lente = { nQuant: 0, vUnit: 0 };

        for (let j = 0; j < cupom.itensCupom.length; j++) {
          const item = cupom.itensCupom[j];
          if (item.xProd.toLowerCase().includes("flanela")) {
            flanela.nQuant += item.nQuant;
            flanela.vUnit = item.vUnit;
          } else if (item.xProd.toLowerCase().includes("estojo")) {
            estojo.nQuant += item.nQuant;
            estojo.vUnit = item.vUnit;
          } else if (item.xProd.toLowerCase().includes("ecobag")) {
            ecobag.nQuant += item.nQuant;
            ecobag.vUnit = item.vUnit;
          } else if (item.xProd.toLowerCase().includes("lente") && item.vUnit < 1) {
            lente.nQuant += item.nQuant;
            lente.vUnit = item.vUnit;
          }
        }

        if (result[cupom.cabecalhoCupom.vendedor] === undefined) {
          result[cupom.cabecalhoCupom.vendedor] = { total: 0 };
        }

        for (let j = 0; j < cupom.itensCupom.length; j += 1) {
          const item = cupom.itensCupom[j];
          if (item.xProd.toLowerCase().includes("grau") && item.xProd.toLowerCase().includes("culos")) {
            if (result[cupom.cabecalhoCupom.vendedor]["grau"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["grau"] = { quant: 0, valor: 0 };
            }
            result[cupom.cabecalhoCupom.vendedor]["grau"].quant += item.nQuant;
            result[cupom.cabecalhoCupom.vendedor]["grau"].valor += item.vItem + (flanela.nQuant > 0 ? flanela.vUnit : 0) + (estojo.nQuant > 0 ? estojo.vUnit : 0) + (ecobag.nQuant > 0 ? ecobag.vUnit : 0) + (lente.nQuant > 0 ? lente.vUnit : 0);
            result[cupom.cabecalhoCupom.vendedor].total += item.vItem + (flanela.nQuant > 0 ? flanela.vUnit : 0) + (estojo.nQuant > 0 ? estojo.vUnit : 0) + (ecobag.nQuant > 0 ? ecobag.vUnit : 0) + (lente.nQuant > 0 ? lente.vUnit : 0);
            total += item.vItem + (flanela.nQuant > 0 ? flanela.vUnit : 0) + (estojo.nQuant > 0 ? estojo.vUnit : 0) + (ecobag.nQuant > 0 ? ecobag.vUnit : 0) + (lente.nQuant > 0 ? lente.vUnit : 0);

            flanela.nQuant -= 1;
            estojo.nQuant -= 1;
            ecobag.nQuant -= 1;
            lente.nQuant -= 1;

          } else if (item.xProd.toLowerCase().includes("sol") && item.xProd.toLowerCase().includes("culos")) {
            if (result[cupom.cabecalhoCupom.vendedor]["sol"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["sol"] = { quant: 0, valor: 0 };
            }
            result[cupom.cabecalhoCupom.vendedor]["sol"].quant += item.nQuant;
            result[cupom.cabecalhoCupom.vendedor]["sol"].valor += item.vItem  + (flanela.nQuant > 0 ? flanela.vUnit : 0) + (estojo.nQuant > 0 ? estojo.vUnit : 0) + (ecobag.nQuant > 0 ? ecobag.vUnit : 0) + (lente.nQuant > 0 ? lente.vUnit : 0);
            result[cupom.cabecalhoCupom.vendedor].total += item.vItem  + (flanela.nQuant > 0 ? flanela.vUnit : 0) + (estojo.nQuant > 0 ? estojo.vUnit : 0) + (ecobag.nQuant > 0 ? ecobag.vUnit : 0) + (lente.nQuant > 0 ? lente.vUnit : 0);
            total += item.vItem  + (flanela.nQuant > 0 ? flanela.vUnit : 0) + (estojo.nQuant > 0 ? estojo.vUnit : 0) + (ecobag.nQuant > 0 ? ecobag.vUnit : 0) + (lente.nQuant > 0 ? lente.vUnit : 0);

            flanela.nQuant -= 1;
            estojo.nQuant -= 1;
            ecobag.nQuant -= 1;
            lente.nQuant -= 1;

          } else if (item.xProd.toLowerCase().includes("lente")) {
            if (result[cupom.cabecalhoCupom.vendedor]["lente"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["lente"] = { quant: 0, valor: 0 };
            }

            if (item.vUnit > 1) { // lente sem ser insumo
              result[cupom.cabecalhoCupom.vendedor]["lente"].quant += item.nQuant;
              result[cupom.cabecalhoCupom.vendedor]["lente"].valor += item.vItem;
              result[cupom.cabecalhoCupom.vendedor].total += item.vItem;
              total += item.vItem;
            }

          } else if (item.xProd.toLowerCase().includes("cordinha") || item.xProd.toLowerCase().includes("clipon") || item.xProd.toLowerCase().includes("clip on")) {
            if (result[cupom.cabecalhoCupom.vendedor]["cordinha"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["cordinha"] = { quant: 0, valor: 0 };
            }
            result[cupom.cabecalhoCupom.vendedor]["cordinha"].quant += item.nQuant;
            result[cupom.cabecalhoCupom.vendedor]["cordinha"].valor += item.vItem;
            result[cupom.cabecalhoCupom.vendedor].total += item.vItem;
            total += item.vItem;

          } else if (item.xProd.toLowerCase().includes("troca") || item.xProd.toLowerCase().includes("conserto")) {
            if (result[cupom.cabecalhoCupom.vendedor]["conserto"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["conserto"] = { quant: 0, valor: 0 };
            }
            result[cupom.cabecalhoCupom.vendedor]["conserto"].quant += item.nQuant;
            result[cupom.cabecalhoCupom.vendedor]["conserto"].valor += item.vItem;
            result[cupom.cabecalhoCupom.vendedor].total += item.vItem;
            total += item.vItem;
          } else if (item.xProd.toLowerCase().includes("bolsa") || item.xProd.toLowerCase().includes('bone') || item.xProd.toLowerCase().includes('canga')) {
            console.dir({item}, { depth: null})
            if (result[cupom.cabecalhoCupom.vendedor]["others"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["others"] = { quant: 0, valor: 0 };
            }
            result[cupom.cabecalhoCupom.vendedor]["others"].quant += item.nQuant;
            result[cupom.cabecalhoCupom.vendedor]["others"].valor += item.vItem;
            result[cupom.cabecalhoCupom.vendedor].total += item.vItem;
            total += item.vItem;
          }
        }

        for (let j = 0; j < cupom.pagamentosCupom.length; j += 1) {
          const item = cupom.pagamentosCupom[j];
          if (item.idContaCorrente === Trocas[store]) {
            if (result[cupom.cabecalhoCupom.vendedor]["troca"] === undefined) {
              result[cupom.cabecalhoCupom.vendedor]["troca"] = { quant: 0, valor: 0 };
            }
            result[cupom.cabecalhoCupom.vendedor]["troca"].quant += 1;
            result[cupom.cabecalhoCupom.vendedor]["troca"].valor += item.nValorDocumento;
          }
        }

        Object.keys(cupom.cabecalhoCupom.pagamentos).forEach((key) => {
          const pagamento = cupom.cabecalhoCupom.pagamentos[key];
          if (pags[pagamento.descricao] === undefined) {
            pags[pagamento.descricao] = 0;
          }
          pags[pagamento.descricao] += pagamento.valor;
        });
      }

      Object.keys(result).forEach(vendedor => {
        result[vendedor].total -= result[vendedor]["troca"]?.valor ?? 0;
        total -= result[vendedor]["troca"]?.valor ?? 0;
        total2 -= result[vendedor]["troca"]?.valor ?? 0;
      });

      setPagamentos(pags);
      setResult(result);
      setTotal(total);
      setTotal2(total2);
    })();
  }, [store, date]);

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <input type="date" value={date} onChange={e => {
            const d = new Date(e.target.value);
            d.setDate(d.getDate() + 1)
            setDate(d);
          }} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Sol</th>
              <th>Grau</th>
              <th>Lente</th>
              <th>Cordinha/Clip On</th>
              <th>Conserto</th>
              <th>Outros</th>
              <th>Troca</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(result).map((vendedor, key) => (
              <tr key={key}>
                <Td>{vendedor}</Td>
                <Td>{result[vendedor].sol?.quant ?? 0}</Td>
                <Td>{result[vendedor].grau?.quant ?? 0}</Td>
                <Td>{result[vendedor].lente?.quant ?? 0}</Td>
                <Td>{result[vendedor].cordinha?.quant ?? 0}</Td>
                <Td>{result[vendedor].conserto?.quant ?? 0}</Td>
                <Td>{result[vendedor].others?.quant ?? 0}</Td>
                <Td>{result[vendedor].troca?.quant ?? 0}</Td>
              </tr>
            ))}
            <tr>
              <th>Vendedor</th>
              <th>Sol</th>
              <th>Grau</th>
              <th>Lente</th>
              <th>Cordinha/Clip On</th>
              <th>Conserto</th>
              <th>Outros</th>
              <th>Troca</th>
              <th>Total de Vendas<br/>(Vendas - Trocas)</th>
            </tr>
            {Object.keys(result).map((vendedor, key) => (
              <tr key={key}>
                <Td>{vendedor}</Td>
                <Td>{formatter.format(result[vendedor].sol?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].grau?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].lente?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].cordinha?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].conserto?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].others?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].troca?.valor.toFixed(2) ?? 0)}</Td>
                <Td>{formatter.format(result[vendedor].total.toFixed(2) ?? 0)}</Td>
              </tr>
            ))}

            <tr>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td>{formatter.format(total ?? 0)}</Td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <Td>Método de pagamento</Td>
              <Td>Valor</Td>
            </tr>
          </thead>
          <tbody>
            {Object.keys(pagamentos).filter(pagamento => !pagamento.toLowerCase().includes("troca")).map((pagamento, key) => (
              <tr key={key}>
                <Td>{pagamento}</Td>
                <Td>{formatter.format(pagamentos[pagamento])}</Td>
              </tr>
            ))}
            <tr><Tdb>Total de Vendas</Tdb><Tdb>{formatter.format(Object.keys(pagamentos).filter(pagamento => !pagamento.toLowerCase().includes("troca")).reduce((acc, curr) => acc + pagamentos[curr], 0))}</Tdb></tr>
            <tr><Tdb>Total de Troca</Tdb><Tdb>{formatter.format(pagamentos["TROCA"] ?? pagamentos["Troca"] ?? pagamentos["troca"] ?? 0)}</Tdb></tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <Td>Pedido Shopify</Td>
              <Td>Nro NF</Td>
              <Td>Consultor(a)</Td>
              <Td>Produtos</Td>
              <Td>Data</Td>
              <Td>Hora</Td>
              <Td>Total</Td>
              <Td>Desconto</Td>
              <Td>Pago</Td>
              <Td>Forma de Pagamento</Td>
            </tr>
          </thead>
          <tbody>
            {cupons?.map((cupon, key) => (<tr key={key}>
              <Td>#{cupon.cabecalhoCupom.seqCaixa}</Td>
              <Td>{cupon.cabecalhoCupom.nNumCupom}</Td>
              <Td>{cupon.cabecalhoCupom.vendedor}</Td>
              <Td>{cupon.itensCupom.map((item, key1) => <p key={key1}>{item.xProd}</p>)}</Td>
              <Td>{cupon.cabecalhoCupom.dDtEmissaoCupom}</Td>
              <Td>{cupon.cabecalhoCupom.cHrEmissaoCupom}</Td>
              <Td>{formatter.format(cupon.cabecalhoCupom.vTotal)}</Td>
              <Td>{formatter.format(cupon.cabecalhoCupom.vDesc)}</Td>
              <Td>{formatter.format(cupon.cabecalhoCupom.vPago)}</Td>
              <Td>{Object.keys(cupon.cabecalhoCupom.pagamentos).map((pag, key2) => <><span key={key2}>{cupon.cabecalhoCupom.pagamentos[pag].descricao} - {formatter.format(cupon.cabecalhoCupom.pagamentos[pag].valor)}</span><br /></>)}</Td>
            </tr>))}
            <tr>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Tdb>Total de Vendas</Tdb>
              <Tdb>{formatter.format(total2)}</Tdb>
            </tr>
          </tbody>
        </table>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}
