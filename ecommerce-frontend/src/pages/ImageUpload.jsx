import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { processImage } from "../services/api";
import cartService from "../services/cartService";
import authService from "../services/authService";
import AuthSuggestionModal from "../components/AuthSuggestionModal";
import ToastNotification from "../components/ToastNotification";
import FloatingNav from "../components/FloatingNav";
import "./ImageUpload.scss";
import {
  FaCamera,
  FaShoppingCart,
  FaCheck,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const webcamRef = useRef(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPreviewUrl(imageSrc);
      setImage(dataURItoBlob(imageSrc));
      setIsCameraOpen(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setToastMessage("Por favor, selecciona o toma una foto antes de enviar.");
      setShowToast(true);
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const data = await processImage(image);
      setToastMessage("Imagen procesada exitosamente.");
      setShowToast(true);
      setResult(data.extractedData);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      setToastMessage("Error al procesar la imagen. Inténtalo de nuevo.");
      setShowToast(true);
    } finally {
      setProcessing(false);
    }
  };

  const addToCart = (product, quantity) => {
    if (!authService.isAuthenticated()) {
      setSelectedProduct(product);
      setShowAuthModal(true);
      return;
    }

    try {
      // Pasar el producto con la cantidad correcta al servicio del carrito
      cartService.addToCart(product, quantity);
      setToastMessage(
        `${product.name} añadido al carrito (${quantity} unidades).`
      );
      setShowToast(true);

      // Añadir al estado de productos añadidos
      setAddedToCart((prev) => [...prev, product.id]);
      setTimeout(
        () => setAddedToCart((prev) => prev.filter((id) => id !== product.id)),
        3000
      );
    } catch (error) {
      setToastMessage(`Error al añadir ${product.name} al carrito.`);
      setShowToast(true);
      console.error(error);
    }
  };

  const updateQuantity = (index, delta) => {
    const updatedResult = { ...result };
    updatedResult.matchedProducts[index].quantity = Math.max(
      1,
      updatedResult.matchedProducts[index].quantity + delta
    );
    setResult(updatedResult);
  };

  const replaceProductWithRecommendation = (index, recommendation) => {
    const updatedResult = { ...result };
    const previousProduct = updatedResult.matchedProducts[index];

    // Añadir el producto actual a las recomendaciones antes de reemplazar
    const updatedRecommendations = [
      ...previousProduct.recommendations.filter(
        (rec) => rec.id !== recommendation.id
      ),
      { ...previousProduct },
    ];

    updatedResult.matchedProducts[index] = {
      ...recommendation,
      quantity: previousProduct.quantity,
      recommendations: updatedRecommendations,
    };

    setResult(updatedResult);
  };

  const renderMatchedProducts = () => (
    <div className="row">
      <h1 className="mb-5">Resultados del Análisis</h1>
      {result.matchedProducts.map((product, index) => (
        <div key={index} className="col-md-6 card mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <img
                src={`https://cataas.com/cat/says/${encodeURIComponent(
                  product.name
                )}?fontSize=20&width=300&height=200`}
                alt="Producto"
                className="img-thumbnail me-3"
                style={{ width: "150px", height: "100px" }}
              />
              <div>
                <h5>{product.name}</h5>
                <p>
                  <b>Precio:</b> ${product.price}{" "}
                </p>
                <p>
                  <b>Stock:</b> {product.stock || 0} unidades
                </p>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(index, -1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  className={`btn mt-2 ${
                    addedToCart.includes(product.id)
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                  onClick={() => addToCart(product, product.quantity)} // Pasar la cantidad correcta
                  disabled={addedToCart.includes(product.id)}
                >
                  {addedToCart.includes(product.id) ? (
                    <FaCheck />
                  ) : (
                    <FaShoppingCart />
                  )}{" "}
                  {addedToCart.includes(product.id)
                    ? "Añadido"
                    : "Añadir al carrito"}
                </button>
              </div>
            </div>

            {product.recommendations?.length > 0 && (
              <>
                <h6>No era lo que buscabas? Revisa aquí:</h6>
                <ul className="list-group">
                  {product.recommendations.map((rec) => (
                    <li
                      key={rec.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      {rec.name} - ${rec.price}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          replaceProductWithRecommendation(index, rec)
                        }
                      >
                        Reemplazar
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="image-upload-container container mt-5">
      <h1 className="mb-3">¡Analiza listas de productos!</h1>
      <p className="section-description text-center mb-4">
        Sube o captura una imagen con una lista de productos para analizarlos
        automáticamente. Asegúrate de que la imagen sea clara y cumpla con las
        recomendaciones para obtener los mejores resultados.
      </p>

      <div className="instructions mb-4">
        <h5 className="text-center mb-2">Recomendaciones para las imágenes:</h5>
        <ul className="list-unstyled text-center">
          <li>No subas fotos borrosas.</li>
          <li>Evita reflejos o sombras fuertes.</li>
          <li>Captura la lista completa y bien alineada.</li>
          <li>Utiliza buena iluminación.</li>
          <li>El fondo debe ser lo más neutro posible.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        {!isCameraOpen ? (
          <div className="mb-3 d-flex">
            <input
              type="file"
              className="form-control me-3"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setIsCameraOpen(true)}
            >
              <FaCamera /> Usar Cámara
            </button>
          </div>
        ) : (
          <div className="camera-container">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <button
              className="btn btn-primary mt-3"
              type="button"
              onClick={capturePhoto}
            >
              Capturar Foto
            </button>
            <button
              className="btn btn-danger mt-3"
              type="button"
              onClick={() => setIsCameraOpen(false)}
            >
              Cancelar
            </button>
          </div>
        )}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Vista previa"
            className="img-thumbnail mt-3"
          />
        )}
        <button
          className="btn btn-primary mt-3"
          type="submit"
          disabled={processing}
        >
          {processing ? "Procesando..." : "Procesar Imagen"}
        </button>
      </form>

      {result?.matchedProducts?.length > 0 && renderMatchedProducts()}

      <AuthSuggestionModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <ToastNotification
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <FloatingNav />
    </div>
  );
};

export default ImageUpload;
