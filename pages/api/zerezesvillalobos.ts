// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const splitted = req.query.date.split("-");

  const pedidos = await fetch(
    "https://app.omie.com.br/api/v1/produtos/cupomfiscalconsultar/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        call: "CuponsFiscais",
        app_key: "2830024503306",
        app_secret: "ec9f00167e51482b0dc6a65857247406",
        param: [
          {
            nPagina: 1,
            dDtEmissaoDe: `${splitted[0]}/${splitted[1]}/${splitted[2]}`,
            dDtEmissaoAte: `${splitted[0]}/${splitted[1]}/${splitted[2]}`,
            nRegPorPagina: 250,
          },
        ],
      }),
    }
  );

  let todosVendedores: any[] = [];
  let paginaVendedores = 1;
  let totalPaginasVendedores = 1;
  do {
    try {
      const vendedoresRes = await fetch(
        "https://app.omie.com.br/api/v1/geral/vendedores/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            call: "ListarVendedores",
            app_key: "2830024503306",
            app_secret: "ec9f00167e51482b0dc6a65857247406",
            param: [{ pagina: paginaVendedores, registros_por_pagina: 50, apenas_importado_api: "N" }],
          }),
        }
      );
      const vendedoresPage = await vendedoresRes.json();
      todosVendedores = todosVendedores.concat(vendedoresPage.cadastro || []);
      totalPaginasVendedores = vendedoresPage.total_de_paginas;
    } catch (err) {
      console.log(`Erro ao buscar página ${paginaVendedores} de vendedores:`, err);
    }
    paginaVendedores++;
  } while (paginaVendedores <= totalPaginasVendedores);

  const contaCorrente = await fetch(
    "https://app.omie.com.br/api/v1/geral/contacorrente/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        call: "ListarContasCorrentes",
        app_key: "2830024503306",
        app_secret: "ec9f00167e51482b0dc6a65857247406",
        param: [
          {
            pagina: 1,
            registros_por_pagina: 250,
            apenas_importado_api: "N",
          },
        ],
      }),
    }
  );

  const pedidosJson = await pedidos.json();
  const contaCorrenteJson = await contaCorrente.json();
  for (let i = 0; i < pedidosJson.cupons.length; i++) {
    const vendedor = todosVendedores.find((vendedor: any) => {
      return vendedor.codigo == pedidosJson.cupons[i].cabecalhoCupom.idVendedor;
    });

    let valorPago = 0;
    let valorDesc = 0;
    let valorTotal = 0;
    for (let j = 0; j < pedidosJson.cupons[i].itensCupom.length; j++) {
      valorPago += parseFloat(pedidosJson.cupons[i].itensCupom[j].vItem);
      valorDesc += parseFloat(pedidosJson.cupons[i].itensCupom[j].vDesc);
      valorTotal +=
        pedidosJson.cupons[i].itensCupom[j].nQuant *
        parseFloat(pedidosJson.cupons[i].itensCupom[j].vUnit);
    }

    pedidosJson.cupons[i].cabecalhoCupom.vPago = valorPago;
    pedidosJson.cupons[i].cabecalhoCupom.vDesc = valorDesc;
    pedidosJson.cupons[i].cabecalhoCupom.vTotal = valorTotal;

    const pagamentos = pedidosJson.cupons[i].pagamentosCupom.reduce(
      (acc: any, item: any) => {
        const conta = contaCorrenteJson.ListarContasCorrentes.find(
          (conta: any) => conta.nCodCC === item.idContaCorrente
        );
        if (acc[item.idContaCorrente]) {
          acc[item.idContaCorrente].valor += item.nValorDocumento;
        } else {
          acc[item.idContaCorrente] = {
            valor: item.nValorDocumento,
            idContaCorrente: item.idContaCorrente,
            nCodCC: conta?.nCodCC,
            descricao: conta?.descricao,
          };
        }

        return acc;
      },
      {}
    );

    pedidosJson.cupons[i].cabecalhoCupom.pagamentos = pagamentos;
    pedidosJson.cupons[i].cabecalhoCupom.vendedor = vendedor?.nome;
  }

  const result = {
    cupons: pedidosJson.cupons.filter(
      (item) => item.cabecalhoCupom.info.cCupomCancelado === "N"
    ),
  };
  return res.status(200).json(result);
}
