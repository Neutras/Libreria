import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { processImage } from "../services/api";
import cartService from "../services/cartService";
import "./ImageUpload.scss";
import { toast } from "react-toastify";
import { FaCamera, FaShoppingCart, FaCheck, FaPlus, FaMinus } from "react-icons/fa";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState([]); // Control para efectos del botón

  const webcamRef = useRef(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPreviewUrl(imageSrc);
      const imageFile = dataURItoBlob(imageSrc);
      setImage(imageFile);
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
      toast.error("Por favor, selecciona o toma una foto antes de enviar.");
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const data = await processImage(image);

      toast.success("Imagen procesada exitosamente.");
      setResult(data.extractedData);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      toast.error("Hubo un problema al procesar la imagen. Inténtalo de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  const addToCart = (product, quantity) => {
    try {
      cartService.addToCart({ ...product, quantity });
      setAddedToCart((prev) => [...prev, product.id]); // Control de efecto visual
      toast.success(`${product.name} añadido al carrito.`);
    } catch (error) {
      toast.error(`Error al añadir ${product.name} al carrito.`);
      console.error(error);
    }
  };

  const updateQuantity = (index, delta) => {
    const updatedResult = { ...result };
    updatedResult.matchedProducts[index].quantity += delta;
    if (updatedResult.matchedProducts[index].quantity < 1) {
      updatedResult.matchedProducts[index].quantity = 1;
    }
    setResult(updatedResult);
  };

  const replaceProductWithRecommendation = (index, recommendation) => {
    const updatedResult = { ...result };
    const currentRecommendations =
      updatedResult.matchedProducts[index].recommendations.filter(
        (rec) => rec.id !== recommendation.id
      );

    const currentProduct = {
      ...updatedResult.matchedProducts[index],
      recommendations: currentRecommendations,
    };

    updatedResult.matchedProducts[index] = {
      ...recommendation,
      quantity: currentProduct.quantity,
      recommendations: [...currentRecommendations, currentProduct],
    };

    setResult(updatedResult);
  };

  const renderMatchedProducts = () => (
    <div className="row">
      {result.matchedProducts.map((product, index) => (
        <div
          key={index}
          className="col-md-6 col-sm-12 card mb-3 matched-product animate__animated animate__fadeIn"
        >
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
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
                  {product.originalPrice ? (
                    <>
                      <span className="text-muted text-decoration-line-through me-2">
                        ${product.originalPrice}
                      </span>
                      <span className="fw-bold text-danger">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span>${product.price}</span>
                  )}
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
                  onClick={() => addToCart(product, product.quantity)}
                  disabled={addedToCart.includes(product.id)}
                >
                  {addedToCart.includes(product.id) ? (
                    <>
                      <FaCheck /> Añadido
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Añadir al carrito
                    </>
                  )}
                </button>
              </div>
            </div>
            {product.recommendations.length > 0 && (
              <>
                <h6 className="mt-3">¿No era lo que buscabas? Revisa aquí:</h6>
                <ul className="list-group">
                  {product.recommendations.map((rec) => (
                    <li
                      key={rec.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
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
      <h1 className="mb-4">Subir y Procesar Imagen</h1>
      <p className="lead">
        Sube o toma una foto de una lista de productos para analizarlos
        automáticamente y agregarlos a tu carrito.
      </p>
      <form onSubmit={handleSubmit}>
        {!isCameraOpen ? (
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Selecciona o toma una foto
            </label>
            <div className="d-flex">
              <input
                type="file"
                id="image"
                className="form-control me-3"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCameraOpen(true)}
              >
                <FaCamera /> Usar cámara
              </button>
            </div>
          </div>
        ) : (
          <div className="camera-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={capturePhoto}
            >
              Capturar Foto
            </button>
            <button
              type="button"
              className="btn btn-danger mt-3"
              onClick={() => setIsCameraOpen(false)}
            >
              Cancelar
            </button>
          </div>
        )}

        {previewUrl && (
          <div className="mb-3">
            <h5>Vista previa:</h5>
            <img
              src={previewUrl}
              alt="Vista previa"
              className="img-thumbnail preview-image"
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={processing}
        >
          {processing ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Procesar Imagen"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-4">
          <h3>Resultados</h3>
          {result.matchedProducts.length > 0 && (
            <div className="mt-3">
              <h4>Productos Coincidentes</h4>
              {renderMatchedProducts()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;