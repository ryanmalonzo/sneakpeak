import json
import os
import random

import httpx
from dotenv import load_dotenv

load_dotenv()

API_URL = os.environ.get("API_URL")
AUTH_TOKEN_KEY = "accessToken"


def post_session(client: httpx.Client) -> httpx.Client:
    r = client.post(
        f"{API_URL}/session",
        json={"email": os.environ.get("EMAIL"), "password": os.environ.get("PASSWORD")},
    )

    if r.status_code == 200:
        auth_token = r.cookies.get(AUTH_TOKEN_KEY)

        if not auth_token:
            raise Exception("auth_token_not_found")

        client.cookies.set(AUTH_TOKEN_KEY, auth_token)

    return client


def post_brand(client: httpx.Client, name: str) -> int | None:
    r = client.post(
        f"{API_URL}/brands",
        json={
            "name": name,
            "image": "https://upload.wikimedia.org/wikipedia/fr/8/8e/Swoosh.svg",
        },
    )

    if r.status_code != 201:
        raise Exception("brand_creation_failed")

    return r.json()["id"]


def post_category(client: httpx.Client, name: str) -> int | None:
    r = client.post(
        f"{API_URL}/categories",
        json={
            "name": name,
            "image": "https://upload.wikimedia.org/wikipedia/fr/8/8e/Swoosh.svg",
        },
    )

    if r.status_code != 201:
        raise Exception("category_creation_failed")

    return r.json()["id"]


def post_sneaker(
    client: httpx.Client,
    name: str,
    description: str,
    price: float,
    brand_id: int,
    category_id: int,
) -> int | None:
    r = client.post(
        f"{API_URL}/sneakers",
        json={
            "name": name,
            "description": description,
            "price": price,
            "brandId": brand_id,
            "categoryId": category_id,
        },
    )

    if r.status_code == 201:
        return r.json()["id"]

    return None


def post_color(client: httpx.Client, name: str, hex_code: str) -> int | None:
    r = client.post(f"{API_URL}/colors", json={"name": name, "hexCode": hex_code})

    if r.status_code != 201:
        raise Exception("color_creation_failed")

    return r.json()["id"]


def post_variant(
    client: httpx.Client,
    stock: int,
    image_url: str,
    is_best: bool,
    sneaker_id: int,
    color_id: int,
    size_id: int,
) -> int | None:
    r = client.post(
        f"{API_URL}/variants",
        json={
            "stock": stock,
            "image": image_url,
            "isBest": is_best,
            "sneakerId": sneaker_id,
            "colorId": color_id,
            "sizeId": size_id,
        },
    )

    if r.status_code != 201:
        raise Exception("variant_creation_failed")

    return r.json()["id"]


def post_sneakers_in_prod() -> None:
    brands = {}
    categories = {}
    colors = {}

    with open("simplified_sneakers.json") as f:
        data = json.load(f)

    with httpx.Client() as client:
        client = post_session(client)

        for sneaker in data:
            if sneaker["brand"] not in brands:
                brand_id = post_brand(client, sneaker["brand"])
                brands[sneaker["brand"]] = brand_id

            if sneaker["category"] not in categories:
                category_id = post_category(client, sneaker["category"])
                categories[sneaker["category"]] = category_id

            sneaker_id = post_sneaker(
                client,
                sneaker["name"],
                sneaker["description"],
                round(random.uniform(50, 200), 2),
                brands[sneaker["brand"]],
                categories[sneaker["category"]],
            )

            if not sneaker_id:
                raise Exception("sneaker_creation_failed")

            for variant in sneaker["variants"]:
                if variant["name"] not in colors:
                    color_id = post_color(client, variant["name"], variant["hexCode"])
                    colors[variant["name"]] = color_id

                post_variant(
                    client,
                    random.randint(10, 300),
                    variant["image"],
                    variant["isBest"],
                    sneaker_id,
                    colors[variant["name"]],
                    random.randint(1, 14),  # static size ids from database
                )


if __name__ == "__main__":
    """
    Prerequisites:
    - User with EMAIL and PASSWORD must exist in the database
    - User must have role ADMIN
    """

    post_sneakers_in_prod()
