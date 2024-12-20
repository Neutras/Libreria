import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./MetricDashboard.scss";

const MetricDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [topCategories, setTopCategories] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChart, setExpandedChart] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const summaryData = await adminService.getMetricsSummary();
        const categoriesData = await adminService.getTopCategories();
        const productsData = await adminService.getTopProducts();
        setMetrics(summaryData);
        setTopCategories(categoriesData.categories);
        setTopProducts(productsData.products);
      } catch (err) {
        console.error("Error al obtener métricas:", err.message);
        setError("No se pudieron cargar las métricas. Por favor, intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

  const generateColors = (length) =>
    Array.from({ length }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);

  if (loading) {
    return <p className="text-center">Cargando métricas...</p>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  const revenueChart = {
    labels: ["Hoy", "Esta semana", "Este mes"],
    datasets: [
      {
        label: "Ingresos",
        data: [
          metrics.revenue.today || 0,
          metrics.revenue.thisWeek || 0,
          metrics.revenue.thisMonth || 0,
        ],
        backgroundColor: generateColors(3),
      },
    ],
  };

  const activeCustomersChart = {
    labels: metrics.activeCustomers.map((customer) => customer.name),
    datasets: [
      {
        label: "Órdenes por cliente",
        data: metrics.activeCustomers.map((customer) => customer.orderCount),
        backgroundColor: generateColors(metrics.activeCustomers.length),
      },
    ],
  };

  const topProductsChart = topProducts && {
  labels: topProducts.map((product) => product.name),
  datasets: [
    {
      label: "Cantidad vendida",
      data: topProducts.map((product) => product.totalQuantity),
      backgroundColor: generateColors(topProducts.length),
      borderWidth: 1,
    },
  ],
};

  const topCategoriesChart = topCategories && {
    labels: topCategories.map((category) => category.category),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: topCategories.map((category) => category.totalQuantity),
        backgroundColor: generateColors(topCategories.length),
      },
    ],
  };

  const toggleChart = (chartName) => {
    setExpandedChart(expandedChart === chartName ? null : chartName);
  };

  return (
    <div className="container metric-dashboard my-5">
      <h1 className="text-center mb-4 text-primary">Panel de Métricas</h1>

      {/* Resumen General */}
      <div className="metrics-summary row mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Ingresos</h5>
              <p className="card-text">
                Hoy: {formatCurrency(metrics.revenue.today || 0)} <br />
                Esta Semana: {formatCurrency(metrics.revenue.thisWeek || 0)} <br />
                Este Mes: {formatCurrency(metrics.revenue.thisMonth || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Clientes Más Activos</h5>
              {metrics.activeCustomers.map((customer, index) => (
                <p key={index} className="card-text">
                  {customer.name} (Pedidos: {customer.orderCount})
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Productos Más Vendidos</h5>
              {metrics.topProducts.map((product, index) => (
                <p key={index} className="card-text">
                  {product.name} (Cantidad: {product.totalQuantity})
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botones para gráficos */}
      <div className="chart-buttons text-center mb-4">
        <button className="btn btn-primary mx-2" onClick={() => toggleChart("revenue")}>
          Ver Ingresos
        </button>
        <button className="btn btn-secondary mx-2" onClick={() => toggleChart("customers")}>
          Ver Clientes Activos
        </button>
        <button className="btn btn-warning mx-2" onClick={() => toggleChart("products")}>
          Ver Productos Más Vendidos
        </button>
        <button className="btn btn-primary mx-2" onClick={() => toggleChart("categories")}>
          Ver Categorías Top
        </button>
      </div>

      {/* Gráficos */}
      {expandedChart === "revenue" && (
        <div className="chart-section mb-4">
          <h5 className="text-center">Ingresos</h5>
          <Bar data={revenueChart} />
        </div>
      )}
      {expandedChart === "customers" && (
        <div className="chart-section mb-4" style={{ width: "500px", height: "500px", margin: "0 auto" }}>
          <h5 className="text-center">Clientes Activos</h5>
          <Pie data={activeCustomersChart} />
        </div>
      )}
      {expandedChart === "products" && (
        <div className="chart-section mb-4">
          <h5 className="text-center">Productos Más Vendidos</h5>
          <Bar data={topProductsChart} />
        </div>
      )}
      {expandedChart === "categories" && topCategoriesChart && (
        <div className="chart-section mb-4">
          <h5 className="text-center">Categorías Top</h5>
          <Bar data={topCategoriesChart} />
        </div>
      )}
    </div>
  );
};

export default MetricDashboard;