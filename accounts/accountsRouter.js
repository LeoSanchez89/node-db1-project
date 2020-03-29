const express = require("express");
const db = require("../data/dbConfig.js");

const router = express.Router();

// get all accts
router.get("/", (req, res) => {
	db.select("*")
		.from("accounts")
		.then(rows => {
			res.status(200).json({ data: rows });
		})
		.catch(error => {
			res.status(500).json({ message: "sorry, ran into an error", error });
		});
});

// get acct by id
router.get("/:id", (req, res) => {
	db("accounts")
		.where({ id: req.params.id })
		.first()
		.then(acct => {
			if (acct) {
				res.status(200).json({ data: acct });
			} else {
				res.status(404).json({ message: "Account not found" });
			}
		})
		.catch(error => {
			res.status(500).json({ message: "sorry, ran into an error", error });
		});
});

// post new acct
router.post("/", (req, res) => {
	if (!req.body.length) {
		res.status(400).json({ message: "missing body" });
	} else {
		db("accounts")
			.insert(req.body, "id")
			.then(ids => {
				res.status(201).json({ results: ids });
			})
			.catch(error => {
				res.status(500).json({ message: "sorry, ran into an error", error });
			});
	}
});

// update acct info
router.put("/:id", (req, res) => {
	if (!req.body.name && !req.body.budget) {
		res.status(400).json({ message: "missing body" });
	} else {
		db("accounts")
			.where({ id: req.params.id })
			.update(req.body)
			.then(count => {
				if (count > 0) {
					res.status(200).json({ message: "account updated successfully" });
				} else {
					res.status(404).json({ message: "account not found" });
				}
			})
			.catch(error => {
				res.status(500).json({ message: "sorry, ran into an error", error });
			});
	}
});

// delete account
router.delete("/:id", (req, res) => {
	db("accounts")
		.where({ id: req.params.id })
		.del()
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: "account deleted successfully" });
			} else {
				res.status(404).json({ message: "account not found" });
			}
		})
		.catch(error => {
			res.status(500).json({ message: "sorry, ran into an error", error });
		});
});

module.exports = router;
