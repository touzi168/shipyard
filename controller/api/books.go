package api

import (
	"encoding/json"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/shipyard/shipyard/auth"
)

func (a *Api) books(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	books, err := a.manager.Books()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(books); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *Api) saveBook(w http.ResponseWriter, r *http.Request) {
	var book *auth.Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := a.manager.SaveBook(book); err != nil {
		log.Errorf("error saving book: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Debugf("updated book: name=%s", book.BookName)
	w.WriteHeader(http.StatusNoContent)
}

func (a *Api) book(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	book, err := a.manager.Book(username)
	if err != nil {
		log.Errorf("error deleting book: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(book); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
func (a *Api) deleteBook(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	book, err := a.manager.Book(username)
	if err != nil {
		log.Errorf("error deleting book: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := a.manager.DeleteBook(book); err != nil {
		log.Errorf("error deleting book: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Infof("deleted book: username=%s id=%s", book.BookName, book.ID)
	w.WriteHeader(http.StatusNoContent)
}
