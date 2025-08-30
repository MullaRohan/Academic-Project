import { useState } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
}

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>(() => {
    const savedAuthors = localStorage.getItem('authors');
    return savedAuthors ? JSON.parse(savedAuthors) : [
      { 
        id: '1', 
        name: 'John Smith', 
        email: 'john@example.com',
        bio: 'Bestselling author of fiction novels'
      }
    ];
  });

  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', bio: '' });

  const handleSave = () => {
    if (editingAuthor) {
      setAuthors(authors.map(author => 
        author.id === editingAuthor.id ? editingAuthor : author
      ));
    } else {
      const author = {
        id: Date.now().toString(),
        ...newAuthor
      };
      setAuthors([...authors, author]);
    }
    setEditingAuthor(null);
    setNewAuthor({ name: '', email: '', bio: '' });
    localStorage.setItem('authors', JSON.stringify(authors));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      setAuthors(authors.filter(author => author.id !== id));
      localStorage.setItem('authors', JSON.stringify(authors.filter(author => author.id !== id)));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-amber-600">
          <h1 className="text-2xl font-bold text-white">MANAGE AUTHORS</h1>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={editingAuthor ? editingAuthor.name : newAuthor.name}
                  onChange={(e) => editingAuthor 
                    ? setEditingAuthor({ ...editingAuthor, name: e.target.value })
                    : setNewAuthor({ ...newAuthor, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={editingAuthor ? editingAuthor.email : newAuthor.email}
                  onChange={(e) => editingAuthor
                    ? setEditingAuthor({ ...editingAuthor, email: e.target.value })
                    : setNewAuthor({ ...newAuthor, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={editingAuthor ? editingAuthor.bio : newAuthor.bio}
                  onChange={(e) => editingAuthor
                    ? setEditingAuthor({ ...editingAuthor, bio: e.target.value })
                    : setNewAuthor({ ...newAuthor, bio: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              {editingAuthor ? 'Update Author' : 'Add Author'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Author Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Bio</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {authors.map(author => (
                  <tr key={author.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        {author.name}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{author.email}</td>
                    <td className="py-3 px-6 text-left">{author.bio}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setEditingAuthor(author)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authors;